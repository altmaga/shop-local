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
        const productListMsg = document.querySelector('#catalogue .empty-data');
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
        // Token
        const localSt = 'tokenUser';
    //

    /*
    Fonctions
    */
        // Check token user or not
        const checkUserToken = (step = 'bag') => {
            new FETCHrequest(`${apiUrl}/me`, 'GET', null, `${localStorage.getItem(localSt)}`)
            .fetch()
            .then( fetchData => {
                if(step === 'bag') {
                    // Check
                    console.log(fetchData);
                    // displayBag(fetchData);
                }
                else if (step === 'checkuser') {
                    console.log(fetchData);
                    // Display navigation of user logged
                    displayNav(fetchData.data.username);
                }
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        };
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
                        // console.log(fetchData.err.errors.email.message)
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

                        // Reset form
                        registerForm.reset();
                        loginForm.reset();
                        // Ajout du tokenn dans le local storage
                        localStorage.setItem(localSt, fetchData.token)
                        // Verif if token is present or not
                        checkUserToken('checkuser');
                        // Display navigation of user logged
                        displayNav(fetchData.data.username);
                        // Display products
                        getSourceProduct();
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                }
                else{
                    console.log('form not ok')
                }
            });
        };

        /* ------------------------------------------------------------------ */
        /* FETCH SHOP */
        /* ------------------------------------------------------------------ */
        const getSourceShop = () => {
            new FETCHrequest(`${apiUrl}/shop`, 'GET')
            .fetch()
            .then( fetchData => {
                console.log('Shop data =>', fetchData);
                // Display list products
                displayShopEntity(fetchData.data);
                displayHero(fetchData.data);
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        };

        // Display collection shop
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
                <button id=""><i class="fas fa-shopping-bag"></i>(<span class="nb-item">0</span>)</button>
                <button id="logout"><i class="fas fa-sign-out-alt"></i></button>
            `;

            // Display nav
            mainNav.classList.remove('hidden');
            // Display hero when log
            wrapperHero.classList.remove('hidden');
            // Display shop
            shopWrapper.classList.remove('hidden');
            // Hide login + register
            areaLog.classList.add('hidden');

            getLogout(document.querySelector('#logout'));
        };

        // Logout
        const getLogout = btn => {
            btn.addEventListener('click', () => {
                console.log(btn);
                // Delete LocalStorage
                localStorage.removeItem(localSt);
                // Hide nav
                mainNav.classList.add('hidden');
                // Hide hero when log
                wrapperHero.classList.add('hidden');
                // Hide shop
                shopWrapper.classList.add('hidden');
                // Display login + register
                areaLog.classList.remove('hidden');
            })
        };

        // Nav user logged display
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
        };

        /* ------------------------------------------------------------------ */
        /* FETCH PRODUCT */
        /* ------------------------------------------------------------------ */
        const getSourceProduct = () => {
            new FETCHrequest(
            `${apiUrl}/product`,
            'GET')
            .fetch()
            .then( fetchData => {
                console.log('Product data =>', fetchData);
                // Display list products
                displayProductList(fetchData.data);
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        };

        // Display all product
        const displayProductList = collection => {
            if(collection.length > 0) {
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
                                    <span class="current-price">${collection[i].current_price}</span>
                                    <span class="starting-price">${collection[i].starting_price}</span>
                                </div>
                                <div class="actions-product">
                                    <button class="see-more" product-id="${collection[i]._id}">Détail</button>
                                    <button class="add-bag" product-id="${collection[i]._id}"><i class="fas fa-shopping-bag"></i></button>
                                </div>
                            </div>
                        </article>
                    `;

                    // Select article onclick
                    getDetailProductLink(document.querySelectorAll('#product button.see-more'));

                    // Select article onclick
                    addProductBag(document.querySelectorAll('#product button.add-bag'), collection[i]);
                };
            } else {
                productListMsg.innerHTML = '';
                productListMsg.innerHTML = `
                    <p>Aucun produits disponible :(</p>
                `;
            }
        };

        // Fetch detail product with id
        const getDetailProductLink = linkDetailProduct => {
            for(let link of linkDetailProduct) {
                link.addEventListener('click', () => {
                    new FETCHrequest(
                    `${apiUrl}/product/${link.getAttribute('product-id')}`, 'GET')
                    .fetch()
                    .then( fetchData => {
                        console.log(fetchData);
                        displayDetailProduct(fetchData.data);
                        // location = '/pages/produit'
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                })
            }
        };

        // Display detail of 1 product
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

        // Fetch bag product with id
        const addProductBag = (linkProduct, data) => {
            for(let link of linkProduct) {
                link.addEventListener('click', () => {
                    console.log(link);
                    console.log(data);
                    new FETCHrequest(
                    `${apiUrl}/bag/`, 'POST', {
                        id_product: data._id,
                        name: data.name,
                        description: data.description,
                        composition: data.composition,
                        category: data.category,
                        current_price: data.current_price,
                        starting_price: data.starting_price,
                        img: data.img,
                        token: localStorage.getItem(localSt)
                    })
                    .fetch()
                    .then( fetchData => {
                        console.log(fetchData);
                        checkUserToken('bag')
                    })
                    .catch( fetchError => {
                        console.log(fetchError)
                    })
                })
            }
        };

        const displayBag = data => {
            // favoriteList.innerHTML = '';
            // for(let item of data){
            //     favoriteList.innerHTML += `
            //         <li>
            //             <button class="eraseFavorite" movie-id="${item._id}"><i class="fas fa-eraser"></i></button>
            //             <span  movie-id="${item.id}">${item.title}</span>
            //         </li>
            //     `;
            // };
            // document.querySelector('#favorite').classList.add('open');
            // getPopinLink( document.querySelectorAll('#favorite li span') );
            // deleteFavorite(document.querySelectorAll('.eraseFavorite'))
        };

    /*
    Lancer IHM
    */
         /*
      Start interface by checkingg if user token is prersent
      */
     if( localStorage.getItem(localSt) !== null ){
        // console.log(localStorage.getItem(localSt))
        // Get user informations
        checkUserToken('checkuser');
        // Si log display product
        getSourceProduct();
      }
      else{
        // Si pas de token donc pas de user connecté donc display formulaire de co
        // Register or login area
        getFormSubmit();
      };

      // Display dans les 2 cas donc par defaut
      // getFormSubmit();
      getSourceShop();
  });