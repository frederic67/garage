const express = require('express');
const { check, validationResult } = require('express-validator');
const pool = require('../database');
const { ensureAdmin } = require('../middlewares/middlewares');

const router = express.Router();

// Validation pour les horaires / Validation for schedules
const hoursValidation = [
    check('day').notEmpty().withMessage('Le jour est requis'),
    check('openTime').notEmpty().withMessage('Heure d\'ouverture est requise'),
    check('closeTime').notEmpty().withMessage('Heure de fermeture est requise')
];

router.get('/api/hours', async (req, res) => {
    try {
        const [actualHours, _] = await pool.query('SELECT * FROM hours');
        res.json(actualHours);
    } catch (error) {
        console.error('Erreur lors de la récupération des heures:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des heures' });
    }
});


router.post('/updateHours', hoursValidation, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { day, openTime, closeTime } = req.body;

    try {
        await pool.query('UPDATE hours SET openTime = ?, closeTime = ? WHERE day = ?', [openTime, closeTime, day]);
        res.redirect('/hours');
    } catch (error) {
        console.error('Erreur lors de la mise à jour des horaires:', error);
        res.status(500).send('Erreur lors de la mise à jour des horaires');
    }
});

router.get('/updateHours', ensureAdmin, async (req, res) => {
    const dayParam = req.query.day;

    try {
        let hour;
        if(dayParam) {
            [hour] = await pool.query('SELECT * FROM hours WHERE day = ?', [dayParam]);
            console.log("Horaires récupérés:", hour); 
        } 

        // Si le jour n'est pas trouvé ou non fourni, initialisez avec des valeurs par défaut / If day is not found or not provided, initialize with default values
        if (!hour) {
            hour = {
                day: '',
                openTime: '',
                closeTime: ''
            };
        }

        res.render('updateHours', {
            day: hour.day,
            openTime: hour.openTime,
            closeTime: hour.closeTime
        });
    } catch (error) {
        console.error('Erreur lors de l\'accès au formulaire de mise à jour des heures:', error);
        res.status(500).send('Erreur lors de l\'accès au formulaire de mise à jour des heures');
    }
});

router.get('/hours', ensureAdmin, async (req, res) => {
    try {
        const [actualHours, _] = await pool.query('SELECT * FROM hours');
        console.log("Horaires récupérés de la base de données:", actualHours); 
        res.render('hoursView', { hours: actualHours }); // Envoie uniquement les horaires réels à la vue / Sends only actual schedules to the view


    } catch (error) {
        console.error('Erreur lors de la récupération des heures:', error);
        res.status(500).send('Erreur lors de la récupération des heures');
    }
});



module.exports = router;
