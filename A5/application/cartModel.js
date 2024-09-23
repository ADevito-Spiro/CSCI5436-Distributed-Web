const fs = require('fs');
let ApplicationModel = require('./applicationModel');
let applicationModel = new ApplicationModel();

let cart = [];

class cartModel {
    constructor() {
        this.getCart();
    }

    getCart() {
        return cart;
    }

    addToCart(productId) {
        let product = applicationModel.getProductById(productId);
        if (product) {
            cart.push(product);
        } else {
            console.error(`Product with ID ${productId} not found.`);
        }
        return cart;
    }

    removeFromCart(productID) {
        let productIndex = cart.findIndex(product => product.id === productID);
        if (productIndex > -1) {
            const [deleted] = cart.splice(productIndex, 1);
            return { success: true, product: deleted };
        } else {
            return { success: false, error: `Product with ID ${productID} not found in cart.` };
        }
    }
}

module.exports = cartModel;