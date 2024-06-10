let ApplicationModel = require('./applicationModel');
let applicationModel = new ApplicationModel();

class application {

    getAllProducts() {
        return applicationModel.getAllProducts();
    }

    getCurrentProduct(id) {
        return applicationModel.getProductById(id);
    }

    getNextID(currentID) {
        return applicationModel.getNextID(currentID);
    }

    getFilters() {
        return applicationModel.getAllFilters();
    }

    getProductByFilter(filter) {
        return applicationModel.getProductByFilter(filter);
    }

    getProductBySearch(search) {
        return applicationModel.getProductBySearch(search);
    }
}


module.exports = application;