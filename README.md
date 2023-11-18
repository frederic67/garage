Configuration initiale pour exécution en local avec XAMPP
Prérequis :
•	XAMPP (pour MySQL et Apache)
•	Node.js et npm (Node Package Manager)
•	Un client Git pour cloner le projet
Étapes d'installation :
Installer XAMPP
Téléchargez et installez XAMPP de Apache Friends.
Démarrer les services Apache et MySQL via le panneau de contrôle XAMPP.
Installer Node.js
Téléchargez et installez Node.js de nodejs.org.
L'installation de Node.js inclura npm, qui est utilisé pour gérer les paquets Node.
Cloner le dépôt Git
git clone url du dépôt garage
 Installer les dépendances Node.js avec npm
Ouvrez un terminal ou invite de commande dans le répertoire du projet.
Exécutez la commande suivante :  
npm install
Ceci installera toutes les dépendances Node.js nécessaires spécifiées dans le package.json.
 Créer une base de données MySQL pour l'application
Ouvrez phpMyAdmin depuis le panneau de contrôle XAMPP.
Créez une nouvelle base de données pour votre application.
Importez la structure de la base de données via l'interface phpMyAdmin ou en exécutant le fichier  .sql  disponible ( annexe E Base de donées).
Configurer l'accès à la base de données
Localisez le fichier de configuration de votre application qui gère la connexion à la base de données (config.js, db.js, database.js, etc.).
Configurez les paramètres de connexion à la base de données avec les valeurs appropriées.
 Démarrer le serveur Node.js
Utilisez la commande suivante pour démarrer votre serveur Node.js :
Node server.js
Accéder à l'application
Accédez à http://localhost:PORT dans votre navigateur, en remplaçant PORT par le port spécifié dans votre configuration du serveur Node.js.
Création d'un Compte Administrateur via SQL
Pour créer un compte administrateur directement dans votre base de données, suivez ces étapes :
Ouvrez phpMyAdmin depuis le panneau de contrôle XAMPP et sélectionnez votre base de données.
Utilisez l'onglet SQL pour exécuter la requête de création de compte administrateur.
Utilisez une requête SQL comme celle-ci, en remplaçant your_hashed_password par un mot de passe haché avec bcrypt :

INSERT INTO `accounts` (`name`, `email`, `password`, `role`, `approved`) VALUES
('AdminName', 'admin@example.com', 'your_hashed_password', 'admin', 1);

Remarque : Ne jamais insérer de mot de passe en clair dans la base de données. Utilisez un générateur de hachage bcrypt en ligne pour sécuriser votre mot de passe.
________________________________________
Ce README fournit une structure de base pour configurer le projet localement.
