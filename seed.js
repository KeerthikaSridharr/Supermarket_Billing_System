const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/supermarket');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const Product = mongoose.model('Product', productSchema);

const products = [
  { name: 'Apple', price: 20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJtbHHFCb8PmvECntJcHU8EwOZQM-9aNFlSw&s.jpg' },
  { name: 'Banana', price: 25, image: 'https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-10/bananas-mc-221004-02-3ddd88.jpg' },
  { name: 'Milk', price: 32, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiQ8CHBCCKqL8w4-pCsXoO787DmN0BnFnwbg&s.jpg' },
  { name: 'Dhal', price: 45, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Imaa1DvCFQqe30fXq9YYvAxYPOqRcGo6Tw&s.jpg' },
  { name: 'Cheese', price: 40, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9elNgzl9xk4ocoFok1EFXBe23OS0tplogIQ&s.jpg' },
  { name: 'Water bottle', price: 60, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvx-qOEFCmhdeBEozVCPZcdU9p4RvD-NQNAw&s.jpg' },
  { name: 'Oil', price: 70, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYFVlndcporT7nSTMF_yrYEUH0JbPFEgg41A&s.jpg' },
  { name: 'Notebook', price: 40, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl0Z7No93DW3rfpg9cdkfoCiWdeQPmJvlEVg&s.jpg' },
  { name: 'Stationery', price: 10, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwEKVvJDJto1XAsb8z7LC3JXIwHqM74n9I8g&s.jpg' },
  { name: 'Orange', price: 15, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-w7ivxdFMWymwq1lRQxYUTcpfy3bHk8EutQ&s.jpg' }
];

Product.insertMany(products)
  .then(() => {
    console.log('Products added');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
