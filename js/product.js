// Product module - handles product display and filtering
class ProductManager {
    constructor() {
        this.products = [];
    }

    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            this.products = data.products;
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    displayProducts(productsToDisplay, container) {
        container.innerHTML = '';

        if (productsToDisplay.length === 0) {
            container.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
            return;
        }

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            container.appendChild(productCard);
        });
    }

    filterProducts(products, searchTerm, category, maxPrice) {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = category === 'all' || product.category === category;
            const matchesPrice = product.price <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }
}

export default ProductManager;