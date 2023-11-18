const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'mafr7435_garage_user',
            password: 'BfHZ)mG9(;?{', // Remplacez par le bon mot de passe
            database: 'mafr7435_garage',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            port: 3306 // Assurez-vous que c'est le bon port
        });

        const connection = await pool.getConnection();
        console.log('Connecté à la base de données!');
        connection.release(); // Toujours libérer la connexion après utilisation.
    } catch (error) {
        console.error('Erreur de connexion:', error);
    }
}

// testConnection();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'mafr7435_garage_user',
    password: 'BfHZ)mG9(;?{', // Remplacez par le bon mot de passe
    database: 'mafr7435_garage',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306 // Assurez-vous que c'est le bon port
});
module.exports = pool;






//const mysql = require('mysql2/promise');

//const pool = mysql.createPool({
    //host: 'localhost',
    //user: 'mafr7435_garage', // Retirer l'espace après le nom d'utilisateur
    //password: 'Morpheus67400', // Ajouter le mot de passe ici
    //database: 'mafr7435_garage', // Retirer l'espace après le nom de la base de données
    //waitForConnections: true,
    //connectionLimit: 10,
    //queueLimit: 0,
    //port: 3306 // Le port doit être 3306 pour MySQL
//});

//module.exports = pool;

