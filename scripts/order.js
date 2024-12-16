let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Load cart from localStorage if available

function addToCart(item, price) {
    const quantityInput = document.getElementById(item.toLowerCase());
    const quantity = parseInt(quantityInput.value) || 0;

    if (quantity > 0) {
        const existingItem = cart.find((cartItem) => cartItem.item === item);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price += quantity * price;
        } else {
            cart.push({ item, quantity, price: quantity * price });
        }

        updateCart();
        quantityInput.value = 0; // Reset input

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        alert('Please enter a valid quantity.');
    }
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(({ item, quantity, price }) => {
        total += price;
        cartItems.innerHTML += `
            <tr>
                <td>${item}</td>
                <td>${quantity}x</td>
                <td>$${price.toFixed(2)}</td> 
            </tr>
        `;
    });

    // Display total price if cart is empty or if items are added
    totalPrice.textContent = cart.length > 0 ? `$${total.toFixed(2)}` : '$0.00';
}

function saveToFavourites() {
    if (cart.length > 0) {
        localStorage.setItem('favourites', JSON.stringify(cart));
        alert('Cart saved to favourites!');
    } else {
        alert('Your cart is empty!');
    }
}

function applyFavourites() {
    const savedCart = JSON.parse(localStorage.getItem('favourites')) || [];
    if (savedCart.length > 0) {
        cart = savedCart;
        updateCart();
        alert('Favourites applied!');
    } else {
        alert('No favourites saved!');
    }
}

function proceedToCheckout() {
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    } else {
        alert('Your cart is empty! Add items before checking out.');
    }
}

function resetCart() {
    cart = [];
    updateCart();
    localStorage.removeItem('cart');  // Remove from localStorage when reset
    alert('Cart has been reset.');
}

// Fetch data from medicines.json and render the medicines dynamically
document.addEventListener("DOMContentLoaded", () => {
    const medicineContainer = document.getElementById("medicine-container");

    fetch("./data/medicines.json")
        .then((response) => response.json())
        .then((categories) => {
            // Clear the loading text
            medicineContainer.innerHTML = "";

            categories.forEach((category) => {
                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = category.category;
                medicineContainer.appendChild(categoryTitle);

                const categoryGrid = document.createElement('div');
                categoryGrid.classList.add('category-grid');

                category.items.forEach((medicine) => {
                    const medicineCard = `
                        <div class="category">
                            <img src="${medicine.image}" alt="${medicine.name}">
                            <h3>${medicine.name}</h3>
                            <p>$${medicine.price}/unit</p>
                            <div class="quantity-control">
                                <button class="minus-btn" onclick="adjustQuantity('${medicine.id}', -1)">-</button>
                                <input type="number" id="${medicine.id}" min="0" value="0">
                                <button class="plus-btn" onclick="adjustQuantity('${medicine.id}', 1)">+</button>
                            </div>
                            <button onclick="addToCart('${medicine.name}', ${medicine.price})">Add</button>
                        </div>
                    `;
                    categoryGrid.innerHTML += medicineCard;
                });

                medicineContainer.appendChild(categoryGrid);
            });
        })
        .catch((error) => {
            console.error("Error fetching medicines:", error);
            medicineContainer.innerHTML = "<p>Failed to load medicines. Please try again later.</p>";
        });

    // Update cart if cart data is present in localStorage on page load
    updateCart();
});

// Function to adjust the quantity
function adjustQuantity(id, change) {
    const input = document.getElementById(id);
    let currentValue = parseInt(input.value) || 0;
    currentValue += change;

    if (currentValue < 0) {
        currentValue = 0; // Prevent negative values
    }

    input.value = currentValue;
}
