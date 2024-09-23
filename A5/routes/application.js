let path = require('path');
let express = require('express');
let router = express.Router();

let applicationController = require('../application/applicationController');



router.get('/product', function(req, res, next) {
    let appController = new applicationController();
    let filter = req.query.filter;
    let search = req.query.search;

    if(filter) {
        let filterProduct = appController.getProductByFilter(filter);
        res.send(filterProduct);
    } else if (search) {
        let searchProduct = appController.getProductBySearch(search);
        res.send(searchProduct);
    } else {
        let products = appController.getAllProducts();
        res.send(products);
    }
});

router.get('/product/filters', function(req, res, next) {
    let appController = new applicationController();
    let data = appController.getFilters();
    res.send(data);
});

router.get('/product/:id', function(req, res, next) {
    let appController = new applicationController();
    let data = appController.getCurrentProduct(parseInt(req.params.id));
    res.send(data);
});

module.exports = router;