let CartModel = require('./cartModel');
let cartModel = new CartModel();

class Cart {
    constructor(req) {
        this.req = req;
    }

    getCart() {
        return cartModel.getCart();
    }
    addToCart(product) {
        return cartModel.addToCart(product);
    }

    removeFromCart(product) {
        return cartModel.removeFromCart(product);
    }
}

module.exports = Cart;