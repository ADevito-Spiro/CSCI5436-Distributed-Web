const fs = require('fs');

class applicationModel {
	constructor() {
		this.initialize();
	}

	initialize() {
        this.products = JSON.parse(fs.readFileSync('./application/data/applicationData.json').toString());
        this.filters = [];
		let tagCount = {};

        //Loop through products to create the filters.
		this.products.forEach(product => {
			product.tags.forEach(tag => {
				if (!tagCount[tag]) {
					tagCount[tag] = 0;
				}
				tagCount[tag]++;
			});
		});
		this.filters = Object.entries(tagCount).map(([tag, count]) => ({ tag, count }));
		this.filters.sort((a, b) => {
			const tagA = a.tag.toLowerCase();
			const tagB = b.tag.toLowerCase();
			if (tagA < tagB) {
				return -1;
			}
			if (tagA > tagB) {
				return 1;
			}
			return 0;
		});

	}

	getAllProducts() {
		return this.products;
	}

    getAllFilters() {
        return this.filters;
    }

	getProductById(id) {
		return this.products.find(product => product.id === id);
	}

	getNextID(currentID) {
		return currentID + 1;
	}

	getProductByFilter(filter) {
		return this.products.filter(product => product.tags.includes(filter));
	}

	getProductBySearch(search) {
		let lowerCaseKeyword = search.toLowerCase();
		return this.products.filter(product => {
			return (
				product.name.toLowerCase().includes(lowerCaseKeyword) ||
				product.shortdesc.toLowerCase().includes(lowerCaseKeyword) ||
				product.longdesc.toLowerCase().includes(lowerCaseKeyword)
			);
		});
	}
}

module.exports = applicationModel;