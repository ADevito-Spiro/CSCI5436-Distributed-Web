const path = require('path');
const express = require('express');
const router = express.Router();

const applicationController = require('../application/applicationController');

router.get('/', function(req, res, next) {
    let appController = new applicationController(req);

    let search = "";
    if (req.query.q !== undefined && req.query.q.length > 0) {
        search = req.query.q;
    }

    let filters = "";
    if (req.query.filters !== undefined && req.query.filters.length > 0) {
        filters = req.query.filters;
    }

    let html = appController.getApplicationPage(search, filters);
    res.send(html);
});

router.get('/:id', function(req, res, next) {
    let appController = new applicationController(req);
    let html = appController.getContentPage(parseInt(req.params.id));
    res.send(html);
});

module.exports = router;