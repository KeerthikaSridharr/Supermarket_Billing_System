const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001; // Change the port number here

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/supermarket');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

// Define the cart schema
const cartSchema = new mongoose.Schema({
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ]
});

// Create models
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

// Redirect root '/' to '/products.html'
app.get('/', (req, res) => {
  res.redirect('/products.html');
});

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Fetch cart items
app.get('/api/cart', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.product');
    if (cart) {
      res.json(cart.items);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Add product to cart
app.post('/api/cart/add/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (product) {
      let cart = await Cart.findOne();
      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = new Cart({ items: [{ product: productId, quantity: 1 }] });
      } else {
        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
        if (itemIndex > -1) {
          // Product already in cart, increase quantity
          cart.items[itemIndex].quantity += 1;
        } else {
          // Product not in cart, add new item
          cart.items.push({ product: productId, quantity: 1 });
        }
      }
      await cart.save();
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Calculate and generate bill
app.get('/api/cart/bill', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.product');
    if (cart) {
      const bill = cart.items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
      }));

      const totalAmount = bill.reduce((sum, item) => sum + item.total, 0);
      res.json({ items: bill, total: totalAmount });
    } else {
      res.json({ items: [], total: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate bill' });
  }
});

// Clear the cart
app.post('/api/cart/clear', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
