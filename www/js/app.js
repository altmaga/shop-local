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
        const shopName = document.querySelector('#shop-name');
        const mainNav = document.querySelector('#main-nav');
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
            'GET', {
                }
            )
            .fetch()
            .then( fetchData => {
                console.log(fetchData);
                // Display list products
                displayShopId(fetchData.data);
            })
            .catch( fetchError => {
                console.log(fetchError)
            })
        }

        const displayShopId = collection => {
            console.log(collection);
            shopName.innerHTML = '';

            for( let i = 0; i < collection.length; i++){
                shopName.innerHTML += `${collection[i].name}`;
            };
        };

        // User logged display
        const displayNav = pseudo => {
          mainNav.innerHTML = `
              <p id="pseudo">Bonjour ${pseudo}</p>
              <button id=""><i class="fas fa-user"></i></button>
              <button id=""><i class="fas fa-shopping-bag"></i></button>
              <button id=""><i class="fas fa-sign-out-alt"></i></button>
          `;

          // Display nav
          mainNav.classList.remove('hidden');
          // Remove login + register
          areaLog.classList.add('hidden');
        }


        // Product
        const getSourceProduct = () => {
            new FETCHrequest(
            `${apiUrl}/product`,
            'GET', {
                }
            )
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
                // Options
                // let reduc = collection[i].reduction !== '' ? console.log('sold') : console.log('r');
                // console.log(reduc);

                let details = '';
                for( let item of collection[i].composition ){ details += `<li>${item.quantity} - ${item.name}</li>` }
                let categories = '';
                for( let item of collection[i].category ){ categories += `<span>${item.name}</span>` }

                productList.innerHTML += `
                    <article>
                        <div>
                            <figure>
                                <img src="${collection[i].img}" alt="${collection[i].name}">
                                <figcaption product-id="${collection[i]._id}">${collection[i].name}</figcaption>
                            </figure>
                            <div>
                                <span>${collection[i].price}</span>
                                <span>${collection[i].reduction}</span>
                            </div>
                            <div>
                                <p>${collection[i].description}</p>
                                <ul>${details}</ul>
                                <p>${categories}</p>
                            </div>
                        </div>
                    </article>
                `;
            };
        };

    /*
    Lancer IHM
    */

    getFormSubmit();
    getSourceProduct();
    getSourceShop();
  });