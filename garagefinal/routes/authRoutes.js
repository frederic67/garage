const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { ensureAdmin } = require('../middlewares/middlewares');
const { pool } = require('../database');

router.post('/login', (req, res, next) => {
    console.log('Data received:', req.body);
    next();
}, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/login', (req, res) => {
    let message = req.flash('error');
    res.render('login', { errorMessage: message.length > 0 ? message[0] : null });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    if  (!req.session) res.end();
    
    req.session.destroy(err => {
      if (err) {
        res.status(400).send('Échec de la déconnexion.')
      } else {
        res.redirect('/login')
      }
    });
});

router.get('/admin/manage-accounts', ensureAdmin, async (req, res) => {
    try {
        const [accounts, fields] = await pool.promise().query('SELECT * FROM accounts');
        res.render('manageAccounts', { accounts: accounts, isAdmin: req.user.role === 'admin' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des comptes');
    }
});

router.post('/admin/create-account', ensureAdmin, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).send('Tous les champs sont nécessaires.');
        }

        const [existingUser] = await pool.promise().query('SELECT email FROM accounts WHERE email = ?', [email]);
        if (existingUser.length) {
            return res.status(400).send('Un compte avec cet e-mail existe déjà.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur avec le rôle "user" / Insert the new user with the "user" role
        await pool.promise().query('INSERT INTO accounts (name, email, password, role) VALUES (?, ?, ?, "user")', [name, email, hashedPassword]);

        res.redirect('/admin/manage-accounts');

    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création du compte');
    }
});

router.delete('/admin/delete-user/:id', ensureAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        await pool.promise().query('DELETE FROM accounts WHERE id = ?', [userId]);
        res.redirect('/admin/manage-accounts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression du compte');
    }
});

module.exports = router;


