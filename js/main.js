import ProductManager from './product.js';
import CartManager from './cart.js';
import StorageManager from './storage.js';

// Initialize managers
const productManager = new ProductManager();
const cartManager = new CartManager();
const storageManager = new StorageManager();

// DOM Elements
const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const maxPriceInput = document.getElementById('max-price');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartDiscount = document.getElementById('cart-discount');
const cartTotal = document.getElementById('cart-total');

let cart = [];

// Initialize app
async function initApp() {
    // Load products from JSON file
    const products = await productManager.loadProducts();
    
    // Load cart from localStorage
    cart = storageManager.loadCart();
    
    // Display products
    productManager.displayProducts(products, productsContainer);
    
    // Update cart UI
    updateCartUI();
    
    // Add event listeners
    setupEventListeners(products);
}

function setupEventListeners(products) {
    // Filter events
    searchInput.addEventListener('input', () => filterProducts(products));
    categoryFilter.addEventListener('change', () => filterProducts(products));
    maxPriceInput.addEventListener('input', () => filterProducts(products));

    // Add to cart events (delegated)
    productsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            cart = cartManager.addToCart(product, cart);
            updateCartUI();
            storageManager.saveCart(cart);
            
            // Show confirmation
            e.target.textContent = 'Added!';
            setTimeout(() => {
                e.target.textContent = 'Add to Cart';
            }, 1000);
        }
    });

    // Cart events
    cartItems.addEventListener('click', (e) => {
        const productId = parseInt(e.target.closest('button')?.getAttribute('data-id'));
        
        if (e.target.classList.contains('decrease')) {
            cart = cartManager.updateQuantity(productId, -1, cart);
        } else if (e.target.classList.contains('increase')) {
            cart = cartManager.updateQuantity(productId, 1, cart);
        } else if (e.target.classList.contains('remove-item')) {
            cart = cartManager.removeFromCart(productId, cart);
        }
        
        updateCartUI();
        storageManager.saveCart(cart);
    });

    // Checkout event
    document.getElementById('checkout-btn').addEventListener('click', checkout);
}

function filterProducts(products) {
    const searchTerm = searchInput.value;
    const selectedCategory = categoryFilter.value;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    const filteredProducts = productManager.filterProducts(
        products, 
        searchTerm, 
        selectedCategory, 
        maxPrice
    );
    
    productManager.displayProducts(filteredProducts, productsContainer);
}

function updateCartUI() {
    const totals = cartManager.getCartTotal(cart);
    
    // Update cart count
    cartCount.textContent = totals.itemCount;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update totals
    cartSubtotal.textContent = `$${totals.subtotal}`;
    cartTax.textContent = `$${totals.tax}`;
    cartDiscount.textContent = `-$${totals.discount}`;
    cartTotal.textContent = `$${totals.total}`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some products before checking out.');
        return;
    }
    
    // Show order confirmation
    document.getElementById('order-confirmation').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    
    // Clear cart
    cart = cartManager.clearCart();
    updateCartUI();
    storageManager.clearCart();
    
    // Close cart sidebar
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);