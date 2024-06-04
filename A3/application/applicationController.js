const fs = require('fs');
const path = require("path");

class application {
    constructor(req) {
        this.req = req;
        this.data = JSON.parse(fs.readFileSync('./application/applicationData.json').toString());
        this.appTemplate = fs.readFileSync('./application/template/application.template').toString();
        this.contentTemplate = fs.readFileSync('./application/template/content.template').toString();
    }

    getApplicationPage(search, filter) {
        let cards = "", tags = "", tagCount = {}, searchResults = "";
        let currentFilter = "", filterResults = "";
        let appTemplate = this.appTemplate;
        let searchFilter = this.data;

        if (search) {
            searchFilter = this.data.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.shortdesc.toLowerCase().includes(search.toLowerCase()) ||
                item.longdesc.toLowerCase().includes(search.toLowerCase())
            );
            searchResults = `<div class="results">${searchFilter.length} results shown for "${search}"</div>`;
        } else {
            searchResults = `<div class="results">${this.data.length} results shown</div>`;
        }

        if (filter) {
            currentFilter = searchFilter.filter(item => item.tags.includes(filter));
            filterResults = `<div class="results">${currentFilter.length} results shown for the "${filter}" filter</div>`;
        } else {
            currentFilter = searchFilter;
            filterResults = `<div class="results">${currentFilter.length} results shown</div>`;
        }

        let finalResults = filter ? filterResults : searchResults;

        appTemplate = appTemplate.replace("{{results}}", finalResults);

        currentFilter.forEach(item => {
            cards = cards + `<div class="griditem"><a href="/application/${item.index}"><img src="${item.image}" alt="${item.name}">${item.name}</a><br>${item.shortdesc}</div>`;
        });

        appTemplate = appTemplate.replace("{{items}}", cards);

        this.data.forEach(product => {
            product.tags.forEach(tag => {
                if (!tagCount[tag]) {
                    tagCount[tag] = 0;
                }
                tagCount[tag]++;
            });
        });

        const sortedTags = Object.keys(tagCount).sort();
        sortedTags.forEach(tag => {
            tags = tags + `<a class="tagsList" id="filter" href="/application/?filters=${tag}">${tag} (${tagCount[tag]})</a><br>`;
        });

        appTemplate = appTemplate.replace("{{tags}}", tags);

        return appTemplate;
    }

    getContentPage(index) {
        let content = this.contentTemplate;
        let longdesc = "";
        let tags = "";
        const item = this.data.find(item => item.index === index);

        content = content.replace("{{name}}", item.name);
        content = content.replace("{{price}}", item.price.toLocaleString());
        content = content.replace("{{image}}", item.image);

        longdesc = longdesc + `<p class="desc">${item.longdesc}`;
        content = content.replace("{{long-desc}}", longdesc);

        tags = tags + `<p class="tags">Tags: ${item.tags.join(", ")}</p>`;
        content = content.replace("{{tags}}", tags);

        if (item.index > 0) {
            content = content.replace("{{prevProduct}}", ((item.index) - 1).toString());
            content = content.replace("{{prev}}", "Previous Product")
        } else {
            content = content.replace("{{prevProduct}}", "");
            content = content.replace("{{prev}}", "No Previous Product")
        }

        if (item.index < this.data.length - 1) {
            content = content.replace("{{nextProduct}}", ((item.index) + 1).toString());
            content = content.replace("{{next}}", "Next product");
        } else {
            content = content.replace("{{nextProduct}}", '0');
            content = content.replace("{{next}}", "Back to Start");
        }
        return content;
    }
}

module.exports = application;