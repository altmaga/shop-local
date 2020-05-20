# NODEapi_boilerplate

Code de départ pour mettre en place une API NodeJS.

## Configuration

Etapes à suivre :

- Créer un fichier `.env` a la racine du serveur en suivant le modèle `.env.dist`.
- Installer les dépendances avec la commande `npm i`
- Innstaller - si ce n'est déjà fait - __NodeMon__ avec la commande `sudo npm i -g nodemon`
- Lancer le serveur avec la commande `npm start`

## MongoDB

# si la base de données n'est pas dans /data/db on doit spécifier le chemin avec --dbpath
sudo mongod --dbpath /Users/alicemouchard/data

# si la base doit écouter sur un port spécifique
mongod --port 42