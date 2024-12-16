document.addEventListener('DOMContentLoaded', function () {
    // Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const paymentMethod = document.getElementById('payment-method');
    const cardDetails = document.getElementById('card-details');

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(({ item, quantity, price }) => {
        total += price;
        cartItems.innerHTML += `<li>${item} - Quantity: ${quantity} - Price: $${price.toFixed(2)}</li>`;
    });

    totalPrice.textContent = `$${total.toFixed(2)}`;

    // Show or hide card details based on payment method selection
    paymentMethod.addEventListener('change', function () {
        if (this.value === 'card') {
            cardDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'none';
        }
    });

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check if the cart has at least one item
        if (cart.length === 0) {
            alert('Your cart is empty! Please add items before checking out.');
            return;
        }

        // Capture user inputs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const deliveryDate = document.getElementById('delivery-date').value;
        const payment = paymentMethod.value;

        if (payment === 'cod') {
            alert(`Thank you, ${name}! Your order will be delivered to ${address} on ${deliveryDate} with Cash on Delivery.`);
        } else {
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;

            // Validate card details 
            if (cardNumber && expiry && cvv) {
                alert(`Thank you, ${name}! Your order will be delivered to ${address} on ${deliveryDate} with Card.`);
            } else {
                alert('Please enter valid card details.');
                return;
            }
        }

        // Clear cart and redirect to home
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
});

// Function to reset cart and form
function resetForm() {
    document.getElementById('checkout-form').reset();
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('total-price').textContent = '0';
    localStorage.removeItem('cart');
}
