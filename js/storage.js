// Storage module - handles localStorage operations
class StorageManager {
    constructor() {
        this.cartKey = 'hamimarket-cart';
    }

    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
    }

    loadCart() {
        const savedCart = localStorage.getItem(this.cartKey);
        return savedCart ? JSON.parse(savedCart) : [];
    }

    clearCart() {
        localStorage.removeItem(this.cartKey);
    }
}

export default StorageManager;