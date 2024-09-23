class PageModel {
    getData(url, callback) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                if (typeof callback === 'function') {
                    callback(JSON.parse(this.responseText));
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send();
    }

    postData(url, data, callback) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                if (typeof callback === 'function') {
                    callback(JSON.parse(this.responseText));
                }
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    }

    deleteData(productID, callback) {
        let xhttp = new XMLHttpRequest();
        let url = `/cart/remove/${productID}`;
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (typeof callback === 'function') {
                            callback(response);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON response:', e);
                        if (typeof callback === 'function') {
                            callback(null);
                        }
                    }
                } else {
                    console.error('Error deleting data. Status:', this.status, 'Response:', this.responseText);
                    if (typeof callback === 'function') {
                        callback(null);
                    }
                }
            }
        };
        xhttp.open("DELETE", url, true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.send();
    }

    getProducts(callback) {
        let url = `/application/product`;
        this.getData(url, callback);
    }

    getFilters(callback) {
        let url = `/application/product/filters`;
        this.getData(url, callback);
    }

    getProductById(id, callback) {
        let url = `/application/product/${id}`;
        this.getData(url, callback);
    }

    getSearchData(search, callback) {
        let url = `/application/product?search=${search}`;
        this.getData(url, callback);
    }

    getFilterData(filter, callback) {
        let url = `/application/product?filter=${filter}`;
        this.getData(url, callback);
    }

    getCart(callback) {
        let url = `/cart/`;
        this.getData(url, callback);
    }

    addCartItem(item, callback) {
        let url = `/cart/add/${item.id}`;
        this.postData(url, {}, callback);
    }
}

class PageView {
    CreateMainPage(data, tags) {
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
            filterBase.href = tags;
            filterBase.className = 'tagsList';
            filterBase.id = 'filter';

            filterBase.innerHTML =`${tag.tag} (${tag.count})`;

            let productDescription = document.createElement('br');

            filterBase.addEventListener('click', (event) => {
                event.preventDefault();
                mainContent.innerHTML = '';
                results.innerHTML = `${tag.count}` + ' results shown for filter: "' + `${tag.tag}` + '"';
                app.getFilter(tag.tag, (filterProducts) => {
                    this.renderProducts(filterProducts);
                });
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

            app.getSearch(query, (searchedProducts) => {
                results.innerHTML = searchedProducts.length + ' results shown for search: "' + query + '"';
                mainContent.innerHTML = '';
                this.renderProducts(searchedProducts);
                searchInput.value = '';
            });
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
        middle.className = 'product-middle';

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
        if(currentID < data.length - 1) {
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

        let cart = document.createElement('button');
        cart.className = 'add-cart';
        cart.id = `add-cart`;
        cart.innerHTML = 'Add to cart';

        cart.addEventListener('click', (event) => {
            event.preventDefault();
            app.getCart((cartItems) => {
                const itemInCart = cartItems.some(item => item.id === currentID);

                if (itemInCart) {
                    cart.innerHTML = 'Already in cart';
                    cart.disabled = true;
                } else {
                    cart.innerHTML = 'Added to cart';
                    cart.disabled = true;
                    app.addToCart(currentID, (updatedCartItems) => {
                        this.CreateCart(updatedCartItems);
                    });
                }
            });
        });

        middle.append(main, next, price, image, description, tags, cart);
    }


    CreateCart(cartItems) {
        let totalCart = 0;
        let cartList = document.getElementById('cart');
        let total = document.getElementById('total-cart');

        cartList.innerHTML = '';

        cartItems.forEach(product => {
            if (product !== null) {
                cartList.innerHTML += `<img src="${product.image}"><p>${product.name} <br> $${product.price} <br> 
                    <button class="delete" onclick="app.deleteCart(${product.id})"><i class="fa fa-trash-o" style="font-size:20px"></i></button></p><br>`;

                totalCart += product.price;
            }
        });

        total.innerHTML = `Total Cart: $${totalCart.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}


class PageController {
    constructor(pageModel, pageView) {
        this.pageModel = pageModel;
        this.pageView = pageView;

        this.createMainPage();
        this.createCart();
    }

    createMainPage() {
        this.pageModel.getProducts((data) => {
            this.pageModel.getFilters((tags) => {
                this.pageView.CreateMainPage(data, tags);
            });
        });
    }

    createProductPage(id) {
        this.pageModel.getProductById(id, (product) => {
            this.pageModel.getProducts((data) => {
                this.pageView.CreateProductPage(product, data);
            });
        });
    }

    getSearch(search, callback) {
        this.pageModel.getSearchData(search, (searchedProducts) => {
            callback(searchedProducts);
        });
    }

    getFilter(filter, callback) {
        this.pageModel.getFilterData(filter, (filterProducts) => {
            callback(filterProducts);
        });
    }

    addToCart(productId, callback) {
        this.pageModel.addCartItem({ id: productId }, (productCart) => {
            this.pageModel.getCart(callback);
        });
    }

    createCart() {
        this.pageModel.getCart((cartItems) => {
            this.pageView.CreateCart(cartItems);
        });
    }

    getCart(callback) {
        this.pageModel.getCart((cartItems) => {
            callback(cartItems);
        });
    }

    deleteCart(productID) {
        this.pageModel.deleteData(productID, (response) => {
            if (response) {
                this.pageModel.getCart((cartItems) => {
                    this.pageView.CreateCart(cartItems);
                });
            }
        });
    }
}

let app = new PageController(new PageModel(), new PageView());
