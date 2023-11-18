const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
    host: 'localhost',
    password: 'BfHZ)mG9(;?{',
    user: 'mafr7435_garage_user',
    database: 'mafr7435_garage'
});

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',  // Le champ où l'email est récupéré dans la requête / The field where the email is retrieved in the query
        passwordField: 'password' // Le champ où le mot de passe est récupéré dans la requête / The field where the password is retrieved in the query
    },
    async (email, password, done) => {
        //console.log("Email:", email);
        //console.log("Password:", password);
        try {
            // Trouver l'utilisateur avec cet email / Find the user with this email
            const [rows] = await pool.query("SELECT * FROM accounts WHERE email = ?", [email]);
            
            if (rows.length === 0) {
                return done(null, false, { message: 'Identifiants incorrects!' });
            }

            const user = rows[0];

            // Vérifier le mot de passe avec bcrypt / Check password with bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const [rows] = await pool.query("SELECT * FROM accounts WHERE id = ?", [id]);
            
            if (rows.length === 0) {
                return done(new Error('No user with that id'));
            }

            const user = rows[0];
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};