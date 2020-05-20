class FETCHrequest {

    constructor(url, requestType, data = null, token = null) {
        this.url = url;
        this.requestType = requestType;
        this.data = data;
        this.token = token;

        // Définition du header de la requête
        this.requestHeader = {
            method: requestType,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        };

        // Ajouter les données dans les requêtes POST et PUT et DELETE
        if( this.requestType === 'POST' || this.requestType === 'PUT' || this.requestType === 'DELETE'){
            this.requestHeader.body = JSON.stringify(data);
        };
    }


    fetch(){
        return new Promise( (resolve, reject) => {
            console.log(this.url)
            fetch( this.url, this.requestHeader )
            .then( apiResponse => {
                // Vérifier le status de la requête
                if( apiResponse.ok ){
                    // Extraire les données JSON de la réponse
                    return apiResponse.json();
                }
                else{
                    // Extraire les données JSON de l'erreur
                    return apiResponse.json()
                    .then(message => reject(message))
                };
            })
            .then( jsonData => resolve(jsonData))
            .catch( apiError => reject(apiError));
        })
    }
}