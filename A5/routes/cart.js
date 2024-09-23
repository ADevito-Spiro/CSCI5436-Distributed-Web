let path = require('path');
let express = require('express');
let router = express.Router();

let cartController = require('../application/cartController');

router.get('/', function(req, res, next) {
    let cartCont = new cartController(req);
    const cartProducts = cartCont.getCart();
    res.json(cartProducts);
});

router.post('/add/:id', function(req, res, next) {
    let cartCont = new cartController(req);
    let id = parseInt(req.params.id, 10);
    let data = cartCont.addToCart(id);
    res.json(data);
});

router.delete('/remove/:id', function(req, res, next) {
    let cartCont = new cartController(req);
    let id = parseInt(req.params.id, 10);
    let data = cartCont.removeFromCart(id);
    res.json(data);
});


module.exports = router;