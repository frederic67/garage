const express = require('express');
const pool = require('../database');  
const router = express.Router();

// Configurez la route POST pour traiter les soumissions de formulaire / Configure the POST route to process form submissions
router.post('/contact', async (req, res) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    const query = 'INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)';
    
    try {
        await pool.query(query, [firstName, lastName, email, phone, subject, message]);
        res.send('Message reçu');
    } catch (error) {
        console.error('Erreur lors de l\'insertion du message:', error);
        res.status(500).send('Erreur serveur');
    }
});
router.get('/dashboard', async (req, res) => {
    try {
        const [messages] = await pool.query('SELECT * FROM contact_messages');
        res.render('dashboard', { messages });
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).send('Erreur serveur');
    }
});
router.post('/dashboard/mark-as-read/:id', async (req, res) => {
    try {
        await pool.query('UPDATE contact_messages SET `read` = TRUE WHERE id = ?', [req.params.id]);

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du message:', error);
        res.status(500).send('Erreur serveur');
    }
});
router.get('/admin/messages', async (req, res) => {
    try {
        const [messages] = await pool.query('SELECT * FROM contact_messages');
        res.render('dashboard', { messages }); 
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;
