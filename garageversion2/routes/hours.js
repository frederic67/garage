const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../database');
const { ensureAdmin } = require('../middlewares/middlewares');

// Validation pour les horaires / Validation for schedules
const hoursValidation = [
    check('day').notEmpty().withMessage('Le jour est requis.'),
    check('openTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('L\'heure d\'ouverture doit être au format HH:mm.'),
    check('closeTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('L\'heure de fermeture doit être au format HH:mm.')
];

// Exemple de route protégée / Example of protected road
router.get('/manage-hours',  (req, res) => {
    
});

// GET les horaires
router.get('/updateHours',  async (req, res) => {
    console.log("Requête reçue pour /admin/updateHours")
    try {
        const [hours, fields] = await pool.query('SELECT * FROM hours');
        res.render('updateHours', { hours: hours });
    } catch (err) {
        res.status(500).send('Erreur lors de la récupération des horaires');
    }
});

// POST pour ajouter ou mettre à jour les horaires / POST to add or update schedules
router.post('/admin/updateHours', ensureAdmin, hoursValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { day, openTime, closeTime } = req.body;
    try {
        // Essayez d'ajouter les heures, si elles existent déjà, mettez-les à jour / Try adding the times, if they already exist update them.
        await pool.query('INSERT INTO hours (day, openTime, closeTime) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE openTime=?, closeTime=?', [day, openTime, closeTime, openTime, closeTime]);
        res.status(201).send('Horaire ajouté/mis à jour avec succès');
    } catch (err) {
        res.status(500).send('Erreur lors de l\'ajout/mise à jour de l\'horaire');
    }
});

// PUT pour mettre à jour un horaire spécifique (par jour) / PUT to update a specific schedule (per day)
router.put('/admin/hours/:day', ensureAdmin, hoursValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { openTime, closeTime } = req.body;
    try {
        await pool.query('UPDATE hours SET openTime = ?, closeTime = ? WHERE day = ?', [openTime, closeTime, req.params.day]);
        res.send('Horaire mis à jour avec succès');
    } catch (err) {
        res.status(500).send('Erreur lors de la mise à jour de l\'horaire');
    }
});

module.exports = router;
