let ApplicationModel = require('./applicationModel');
let applicationModel = new ApplicationModel();

class Application {
    getAllProducts() {
        return applicationModel.getAllProducts();
    }

    getCurrentProduct(id) {
        return applicationModel.getProductById(id);
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

module.exports = Application;
