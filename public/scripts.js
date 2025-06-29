document.addEventListener("DOMContentLoaded", () => {
  const cartDiv = document.getElementById('cart');
  const checkoutButton = document.getElementById('checkout-button');

  // Fetch cart items from the server and display them
  fetch('/api/cart')
    .then(response => response.json())
    .then(cartItems => {
      cartDiv.innerHTML = ''; // Clear existing content
      cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
          <img src="${item.product.image}" alt="${item.product.name}" width="100">
          <p>${item.product.name}</p>
          <p>$${item.product.price}</p>
          <p>Quantity: ${item.quantity}</p>
        `;
        cartDiv.appendChild(cartItemDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching cart items:', error);
    });

  // Event listener for checkout button
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }

  // Add product to cart buttons (for product page)
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;

      fetch(`/api/cart/add/${productId}`, {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Product added to cart!');
        } else {
          alert('Failed to add product to cart.');
        }
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
    });
  });

  // Event listener for bill button in cart page
  const billButton = document.getElementById('bill-button');
  if (billButton) {
    billButton.addEventListener('click', () => {
      window.location.href = 'bill.html';
    });
  }

  // Clear Cart button functionality
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the cart?')) {
        fetch('/api/cart/clear', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Cart cleared!');
              const cartDiv = document.getElementById('cart');
              if (cartDiv) cartDiv.innerHTML = ''; // Clear cart display
            } else {
              alert('Failed to clear cart.');
            }
          })
          .catch(error => {
            console.error('Error clearing cart:', error);
            alert('Error clearing cart.');
          });
      }
    });
  }
});

// Fetch and display bill details on the bill page
window.onload = function() {
  if (document.getElementById('bill')) {
    fetchBill();
  }
};

// Function to fetch bill details and display them
function fetchBill() {
  fetch('/api/cart/bill')
    .then(response => response.json())
    .then(data => {
      const billContainer = document.getElementById('bill');
      billContainer.innerHTML = ''; // Clear any existing content

      data.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('bill-item');
        itemElement.innerHTML = `
          <p>${item.name} - $${item.price} x ${item.quantity} = $${item.total}</p>
        `;
        billContainer.appendChild(itemElement);
      });

      const totalElement = document.createElement('p');
      totalElement.innerHTML = `Total: $${data.total}`;
      billContainer.appendChild(totalElement);
    })
    .catch(error => {
      console.error('Error fetching bill:', error);
      const billContainer = document.getElementById('bill');
      billContainer.innerHTML = '<p>Error fetching bill. Please try again later.</p>';
    });
}
