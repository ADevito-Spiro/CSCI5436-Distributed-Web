class PageModel {

    getData(url) {
        let data = {};
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, false);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send();
        if (xhttp.status === 200) {
            data = JSON.parse(xhttp.responseText);
        } else {
            console.error("Request failed with status: " + xhttp.status);
            console.error(xhttp.responseText);
        }
        return data;
    }
    getProducts() {
        let url = `/application/product`;
        return this.getData(url);
    }

    getFilters() {
        let url = `/application/product/filters`;
        return this.getData(url);
    }

    getProductById(id) {
        let url = `/application/product/${id}`;
        return this.getData(url);
    }

    getSearchData(search) {
        let url = `/application/product?search=${search}`;
        return this.getData(url);
    }

    getFilterData(filter) {
        let url = `/application/product?filter=${filter}`;
        return this.getData(url);
    }
}

class PageView {

    CreateMainPage(data, tags, filters) {
        let mainContent = document.getElementById('main-content');
        mainContent.className = 'middle-grid';

        let list = document.getElementById('filter-tags');
        list.innerHTML = '';

        let results = document.getElementById('results');
        results.innerHTML = `${data.length}` + ' results shown';

        data.forEach(product => {
            this.renderProducts([product]);
        });

        let filtersDiv = document.getElementById('filter-tags');
        tags.forEach(tag => {
            let filterBase = document.createElement('a');
            filterBase.href = filters;
            filterBase.className = 'tagsList';
            filterBase.id = 'filter';

            filterBase.innerHTML =`${tag.tag} (${tag.count})`;

            let productDescription = document.createElement('br');

            filterBase.addEventListener('click', (event) => {
                event.preventDefault();
                mainContent.innerHTML = '';
                results.innerHTML = `${tag.count}` + ' results shown for filter "' + `${tag.tag}` + '"';
                this.renderProducts(app.getFilter(tag.tag));
            });
            filterBase.append(productDescription);
            filtersDiv.append(filterBase);
        });

        let searchForm = document.getElementById('search');
        let searchInput = searchForm.querySelector('.query');
        let button = document.getElementById('submit');
        button.addEventListener('click', (event) => {
            event.preventDefault();
            let query = searchInput.value;

            let searchedProducts = app.getSearch(query);
            results.innerHTML = searchedProducts.length + ' results shown for "' + query + '"';
            mainContent.innerHTML = '';
            this.renderProducts(searchedProducts);

            searchInput.value = '';
        });


        let clear = document.getElementById('remove');
        clear.addEventListener('click', (event) => {
            mainContent.innerHTML = '';
            results.innerHTML = `${data.length}` + ' results shown';
            data.forEach(product => {
                this.renderProducts([product]);
            });
        })
    }

    renderProducts(products) {
        let mainContent = document.getElementById('main-content');
        mainContent.className = 'middle-grid';

        let search = document.getElementById('search');
        search.style.display = 'block';

        let filters = document.getElementById('filters');
        filters.style.display = 'block';

        let results = document.getElementById('results');
        results.style.display = 'block';

        products.forEach(product => {
            let productDiv = document.createElement('div');
            productDiv.className = 'griditem';

            let productLink = document.createElement('a');
            productLink.href ='';
            productLink.addEventListener('click', (event) => {
                event.preventDefault();
                app.createProductPage(product.id);
            });

            let productImage = document.createElement('img');
            productImage.src = `${product.image}`;

            let productName = document.createTextNode(product.name);
            let productDescription = document.createElement('br');
            let productDescText = document.createTextNode(product.shortdesc);

            productLink.append(productImage, productName);
            productDiv.append(productLink, productDescription, productDescText);
            mainContent.append(productDiv);
        });
    }

    CreateProductPage(product, data) {
        let search = document.getElementById('search');
        search.style.display = 'none';

        let filters = document.getElementById('filters');
        filters.style.display = 'none';

        let results = document.getElementById('results');
        results.style.display = 'none';

        let middle = document.getElementById('main-content');
        middle.innerHTML = '';
        middle.className = 'product-middle'

        let main = document.createElement('div');
        main.className = 'buttons';
        main.innerHTML = "<b><</b> Back to Home";

        main.addEventListener('click', (event) => {
            event.preventDefault();
            middle.innerHTML = '';
            app.createMainPage();
        });

        let currentID = product.id;
        let nextID;

        let next = document.createElement('div');
        next.href = ``;
        next.className = 'buttons';
        if(currentID < data.length-1) {
            next.innerHTML = "Next Product <b>></b>";
             nextID = currentID + 1;
        } else {
            next.innerHTML = "<b><</b> Back to the Start";
            nextID = 0;
        }

        next.addEventListener('click', (event) => {
           event.preventDefault();
           app.createProductPage(nextID);
        });

        let price = document.createElement('h2');
        price.textContent = `Price: $${product.price}`;

        let image = document.createElement('img');
        image.src = `${product.image}`;
        image.alt = `${product.name}`;

        let description = document.createElement('p');
        description.innerHTML = `${product.longdesc}`;

        let tags = document.createElement('p');
        tags.textContent = `Tags: ${product.tags}`;

        let cart = document.createElement('div');
        cart.className = 'cart';
        cart.id = 'cart';
        cart.innerHTML = `Add to cart`;

        cart.addEventListener('click', (event) => {
            app.createCart(product);
        })
        middle.append(main, next, price, image, description, tags);
    }

    createCart(product) {

    }
}


class PageController {
    constructor(pageModel, pageView) {
        this.pageModel = pageModel;
        this.pageView = pageView;

        this.createMainPage();
    }

    createMainPage() {
        let data = this.pageModel.getProducts();
        let tags = this.pageModel.getFilters();
        let filters = this.pageModel.getFilters();
        this.pageView.CreateMainPage(data, tags, filters);
    }

    createProductPage(id) {
        let product = this.pageModel.getProductById(id);
        let data = this.pageModel.getProducts();
        this.pageView.CreateProductPage(product, data);
    }

    getSearch(search) {
        return this.pageModel.getSearchData(search);
    }

    getFilter(filter) {
        return this.pageModel.getFilterData(filter);
    }

    createCart(product){
        return this.pageModel.createCart(product);
    }
}

let app = new PageController(new PageModel(), new PageView());