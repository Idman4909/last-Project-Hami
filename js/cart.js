// Cart module - handles cart functionality
class CartManager {
    constructor() {
        this.cart = [];
    }

    addToCart(product, cart) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        return cart;
    }

    removeFromCart(productId, cart) {
        return cart.filter(item => item.id !== productId);
    }

    updateQuantity(productId, change, cart) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                return this.removeFromCart(productId, cart);
            }
        }
        
        return cart;
    }

    getCartTotal(cart) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const discount = subtotal >= 50 ? subtotal * 0.1 : 0;
        const total = subtotal + tax - discount;

        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            discount: discount.toFixed(2),
            total: total.toFixed(2),
            itemCount: cart.reduce((total, item) => total + item.quantity, 0)
        };
    }

    clearCart() {
        this.cart = [];
        return this.cart;
    }
}

export default CartManager;