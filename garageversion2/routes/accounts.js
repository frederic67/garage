const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'garage'
});

// Middleware pour la validation / Middleware for validation
const accountValidation = [
    check('name').isString().withMessage('Le nom doit être une chaîne de caractères.'),
    check('email').isEmail().withMessage('Veuillez fournir un e-mail valide.'),
    check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit comporter au moins 6 caractères.')
];

// CREATE account
router.post('/accounts', accountValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [results] = await pool.promise().query('INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.json({ id: results.insertId, name, email });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// READ all accounts
router.get('/accounts', async (req, res) => {
    try {
        const [results] = await pool.promise().query('SELECT id, name, email FROM accounts');
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// UPDATE account
router.put('/accounts/:id', accountValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    try {
        if (hashedPassword) {
            await pool.promise().query('UPDATE accounts SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPassword, req.params.id]);
        } else {
            await pool.promise().query('UPDATE accounts SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);
        }
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// DELETE account
router.delete('/accounts/:id', async (req, res) => {
    try {
        await pool.promise().query('DELETE FROM accounts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
