/*
Attendre le chargement du DOM
*/
document.addEventListener('DOMContentLoaded', () => {

    /*
    Déclarations
    */
        // Generals
        const apiUrl = '/api/mongo';
        // VAriables
        const productList = document.querySelector('#product-list');
        // Connnexion
        const areaLog = document.querySelector('#espace-co');
        // Register
        const registerForm = document.querySelector('#register-form');
        const userEmail = document.querySelector('[name="user-email"]');
        const userPassword = document.querySelector('[name="user-password"]');
        const userUsername = document.querySelector('[name="user-name"]');
        // Login
        const loginForm = document.querySelector('#login-form');
        const loginEmail = document.querySelector('[name="login-email"]');
        const loginPassword = document.querySelector('[name="login-password"]');
        // Shop variables
        const shopNameLogo = document.querySelector('#shop-item #shop-logo');
        const shopNameTitle = document.querySelector('#shop-item #shop-title');
        const shopNameFooter = document.querySelector('#shop-contact');
        const mainNav = document.querySelector('#main-nav');
        const shopWrapper = document.querySelector('#shop');
        const titleSite = document.querySelector('title');
        // const faviconSite = document.querySelector('link[rel="icon"]');
        // Hero
        const wrapperHero = document.querySelector('#wrapper-hero');
        const hero = document.querySelector('#hero');
        const heroItems = document.querySelector('#wrapper-items');
        // Product
        const productDetail = document.querySelector('#product-detail article');
    //

    /*
    Fonctions
    */
        // Register - Login
        const getFormSubmit = () => {
            // Get registerForm submit
            registerForm.addEventListener('submit', event => {
                // Stop event propagation
                event.preventDefault();

                // Check form data
                let formError = 0;

                if(userEmail.value.length < 5) { formError++ };
                if(userPassword.value.length < 5) { formError++ };
                if(userUsername.value.length < 2) { formError++ };

                if(formError === 0){
                    new FETCHrequest(`${apiUrl}/register`, 'POST', {
                        email: userEmail.value,
                        password: userPassword.value,
                        username: userUsername.value,
                    })
                    .fetch()
                    .then( fetchData => {
                        console.log(fetchData)
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                }
                else {
                    console.log('form not ok')
                }
            });
            // Get loginForm submit
            loginForm.addEventListener('submit', event => {
                // Stop event propagation
                event.preventDefault();

                // Check form data
                let formError = 0;

                if(loginEmail.value.length < 5) { formError++ };
                if(loginPassword.value.length < 5) { formError++ };

                if(formError === 0){
                    new FETCHrequest(`${apiUrl}/login`, 'POST', {
                        email: loginEmail.value,
                        password: loginPassword.value
                    })
                    .fetch()
                    .then( fetchData => {
                        console.log(fetchData);
                        console.log(fetchData.data);
                        displayNav(fetchData.data.username);
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                }
                else{
                    console.log('form not ok')
                }
            });
        }

        // Shop
        const getSourceShop = () => {
            new FETCHrequest(
            `${apiUrl}/shop`,
            'GET')
            .fetch()
            .then( fetchData => {
                console.log(fetchData);
                // Display list products
                displayShopEntity(fetchData.data);
                displayHero(fetchData.data);
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        }

        const displayShopEntity = collection => {
            // console.log(collection);
            shopNameLogo.innerHTML = '';
            shopNameTitle.innerHTML = '';
            shopNameFooter.innerHTML = '';

            for( let i = 0; i < collection.length; i++){
                titleSite.innerHTML += `${collection[i].name}`;

                shopNameLogo.innerHTML += `
                    <img src="${collection[i].logo}" alt="${collection[i].name}">
                `;

                shopNameTitle.innerHTML += `
                    <h1 class="${collection[i]._id}">${collection[i].name}</h1>
                    <span>${collection[i].baseline}</span>
                `;

                // Array object
                let hours = '';
                for( let item of collection[i].hours ){ hours += `<li>${item.day} - ${item.hour}</li>` }

                shopNameFooter.innerHTML += `
                    <div id="shop-logo-footer">
                        <img src="${collection[i].logo}" alt="${collection[i].name}">
                        <p>${collection[i].informations.site}</p>
                    </div>
                    <div>
                        <ul>${hours}</ul>
                    </div>
                    <div id="shop-info">
                        <div class="contact">
                            <p>${collection[i].informations.address}</p>
                            <p>${collection[i].informations.cp}</p>
                            <p>${collection[i].informations.tel}</p>
                        </div>
                        <div class="rs">
                            <a href="${collection[i].informations.facebook}"><i class="fab fa-facebook-square"></i></a>
                            <a href="${collection[i].informations.instagram}"><i class="fab fa-instagram-square"></i></a>
                        </div>
                    </div>
                `;
            };
        };

        // User logged display
        const displayNav = pseudo => {
          mainNav.innerHTML = '';

          mainNav.innerHTML = `
              <p id="pseudo">Bonjour ${pseudo}</p>
              <button id=""><i class="fas fa-user"></i></button>
              <button id=""><i class="fas fa-shopping-bag"></i></button>
              <button id=""><i class="fas fa-sign-out-alt"></i></button>
          `;

          // Display nav
          mainNav.classList.remove('hidden');
          // Display hero when log
          wrapperHero.classList.remove('hidden');
          // Display shop
          shopWrapper.classList.remove('hidden');
          // Remove login + register
          areaLog.classList.add('hidden');
        }

        // User logged display
        const displayHero = collection => {
            console.log(collection);
            // Display data in hero
            hero.innerHTML = '';
            heroItems.innerHTML = '';

            for(let i = 0; i < collection.length; i++) {
                hero.innerHTML = `<img src="${collection[i].img}" alt="${collection[i].name}">`;
                // Array object
                let itemsShop = '';
                for( let item of collection[i].items ){ itemsShop += `<li>${item.item}</li>` }
                heroItems.innerHTML = `
                    <div id="shop-items" class="container"><ul>${itemsShop}</ul></div>
                `;
            }
        }


        // Product
        const getSourceProduct = () => {
            new FETCHrequest(
            `${apiUrl}/product`,
            'GET')
            .fetch()
            .then( fetchData => {
                console.log(fetchData);
                // Display list products
                displayProductList(fetchData.data);
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        }

        const displayProductList = collection => {
            console.log(collection);
            productList.innerHTML = '';

            for( let i = 0; i < collection.length; i++){
                productList.innerHTML += `
                    <article id="product" product-id="${collection[i]._id}">
                        <div id="preview-product">
                            <figure>
                                <img src="${collection[i].img}" alt="${collection[i].name}">
                                <figcaption>${collection[i].name}</figcaption>
                            </figure>
                            <div>
                                <span class="price">${collection[i].price}</span>
                                <span class="reduc">${collection[i].reduction}</span>
                            </div>
                            <div>
                                <button product-id="${collection[i]._id}">Détail</button>
                            </div>
                        </div>
                    </article>
                `;

                // Select article onclick
                getDetailProductLink(document.querySelectorAll('#product button'));
            };
        };

        const getDetailProductLink = linkCollection => {
            for(let link of linkCollection) {
                link.addEventListener('click', () => {
                    new FETCHrequest(
                    `${apiUrl}/product/${link.getAttribute('product-id')}`,
                    'GET')
                    .fetch()
                    .then( fetchData => {
                        console.log(fetchData);
                        displayDetailProduct(fetchData.data);
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                })
            }
        };

        const displayDetailProduct = data => {
            console.log(data);
            // Options
            let categories = '';
            for( let item of data.category ){ categories += `<span>${item.name}</span>` }
            let details = '';
            for( let item of data.composition ){ details += `<li>${item.quantity} - ${item.name}</li>` }
            productDetail.innerHTML = `
                <figure>
                    <img src="${data.img}" alt="${data.name}">
                    <figcaption>${data.name}</figcaption>
                </figure>
                <div>
                    <div id="detail-product">
                        <p>${data.description}</p>
                        <ul>${details}</ul>
                        <p>${categories}</p>
                    </div>
                    <button id="favoriteButton"><i class="fas fa-bookmark"></i></button>
                    <button id="closeButton"><i class="fas fa-times"></i></button>
                </div>
            `;
            // addFavorite(document.querySelector('#favoriteButton'), data)
            productDetail.parentElement.classList.add('open');
        };

    /*
    Lancer IHM
    */

    getFormSubmit();
    getSourceProduct();
    getSourceShop();
  });