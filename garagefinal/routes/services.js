const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../database');
const { ensureAdmin } = require('../middlewares/middlewares');

const serviceValidation = [
    check('name').notEmpty().withMessage('Le nom du service est requis.'),
    check('description').notEmpty().withMessage('La description est requise.'),
    check('price').isNumeric().withMessage('Le prix doit être un nombre.')
];

router.get('/', ensureAdmin, async (req, res) => {
    try {
        const [services] = await pool.query('SELECT * FROM services');
        res.render('displayServices', { services, success_msg: req.flash('success_msg'), isAdmin: true });

    } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
        res.status(500).send('Erreur lors de la récupération des services');
    }
});

router.get('/add', ensureAdmin, (req, res) => {
    res.render('addService');
});

router.post('/update/:id', ensureAdmin, serviceValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, price } = req.body;
    const serviceId = req.params.id;

    try {
        await pool.execute(
            "UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?",
            [name, description, price, serviceId]
        );

        req.flash('success_msg', 'Service mis à jour avec succès.');
        res.redirect('/services');

    } catch (err) {
        console.error("Erreur lors de la mise à jour du service:", err);
        req.flash('error_msg', 'Erreur lors de la mise à jour du service.');
        res.redirect('/services');
    }
});

router.post('/add', ensureAdmin, serviceValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price } = req.body;

    try {
        await pool.execute(
            "INSERT INTO services (name, description, price) VALUES (?, ?, ?)",
            [name, description, price]
        );

        res.redirect('/services');

    } catch (err) {
        console.error("Erreur lors de l’ajout du service:", err);
        req.flash('error_msg', 'Erreur lors de l’ajout du service.');
        res.redirect('/services/add');
    }
});

router.get('/delete/:id', ensureAdmin, async (req, res) => {
    try {
        const serviceId = req.params.id;
        await pool.execute(
            "DELETE FROM services WHERE id = ?",
            [serviceId]
        );

        res.redirect('/services');

    } catch (err) {
        console.error("Erreur lors de la suppression du service:", err);
        req.flash('error_msg', 'Erreur lors de la suppression du service.');
        res.redirect('/services');
    }
});
router.get('/nos-services', async (req, res) => {
    try {
        const [services] = await pool.query('SELECT * FROM services');

        // Convertir le prix de chaque service en nombre / Convert the price of each service into a number
        services.forEach(service => {
            service.price = parseFloat(service.price);
        });    
        res.render('nosServices', { services });
    } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
        res.status(500).send('Erreur lors de la récupération des services');
    }
});
router.get('/update/:id', ensureAdmin, async (req, res) => {
    const serviceId = req.params.id;
    const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [serviceId]);
    if (service) {
        res.render('updateService', { service });
    } else {
        req.flash('error_msg', 'Service non trouvé.');
        res.redirect('/services');
    }
});

module.exports = router;
