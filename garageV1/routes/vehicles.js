const express = require('express');
const { check, validationResult } = require('express-validator');
const morgan = require('morgan');
const multer = require('multer');
const router = express.Router();
const pool = require('../database');
const { ensureAdmin } = require('../middlewares/middlewares'); 

// Configuration de morgan pour le logging des requêtes / Configuring morgan for query logging
router.use(morgan('combined'));

// Configuration de multer pour le stockage des images / Configuring multer for image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Validation pour les véhicules / Validation for vehicles
const vehiclesValidation = [
    check('brand').notEmpty().withMessage('La marque est requise.'),
    check('model').notEmpty().withMessage('Le modèle est requis.'),
    check('year').isNumeric().withMessage('L\'année doit être numérique.'),
    check('price').isNumeric().withMessage('Le prix doit être numérique.'),
    check('description').notEmpty().withMessage('La description est requise.'),
];

router.get('/', ensureAdmin, async (req, res) => {
    try {
        const [vehicles] = await pool.query('SELECT * FROM vehicles');
        res.render('displayVehicles', { vehicles, success_msg: req.flash('success_msg') });
    } catch (err) {
        console.error("Erreur lors de la récupération des véhicules:", err);
        res.status(500).send('Erreur lors de la récupération des véhicules');
    }
});

router.get('/add', ensureAdmin, (req, res) => {
    res.render('addVehicle'); 
});

router.post('/add', ensureAdmin, upload.single('image'), vehiclesValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { brand, model, year, price, description, mileage } = req.body; 
    const imagePath = '/uploads/' + req.file.filename;

    try {
        await pool.execute(
            "INSERT INTO vehicles (brand, model, year, price, description, image_url, mileage) VALUES (?, ?, ?, ?, ?, ?, ?)", // Ajout de mileage dans la requête SQL
            [brand, model, year, price, description, imagePath, mileage] 
        );

        req.flash('success_msg', 'Véhicule ajouté avec succès.');
        res.redirect('/vehicles');

    } catch (err) {
        console.error("Erreur lors de l’ajout du véhicule:", err);
        req.flash('error_msg', 'Erreur lors de l’ajout du véhicule.');
        res.redirect('/vehicles/add');
    }
});

router.post('/update/:id', ensureAdmin, upload.single('image'), vehiclesValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { brand, model, year, price, description, mileage } = req.body; 
    let imagePath;
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
    }
    
    try {
        if (imagePath) {
            await pool.execute(
                "UPDATE vehicles SET brand = ?, model = ?, year = ?, price = ?, description = ?, image_url = ?, mileage = ? WHERE id = ?", 
                [brand, model, year, price, description, imagePath, mileage, req.params.id] 
            );
        } else {
            await pool.execute(
                "UPDATE vehicles SET brand = ?, model = ?, year = ?, price = ?, description = ?, mileage = ? WHERE id = ?", 
                [brand, model, year, price, description, mileage, req.params.id] 
            );
        }
        
        req.flash('success_msg', 'Véhicule mis à jour avec succès.');
        res.redirect('/vehicles');

    } catch (err) {
        console.error("Erreur lors de la mise à jour du véhicule:", err);
        req.flash('error_msg', 'Erreur lors de la mise à jour du véhicule.');
        res.redirect(`/vehicles/edit/${req.params.id}`);
    }
});


// Route pour supprimer un véhicule / Route to delete a vehicle
router.get('/delete/:id', ensureAdmin, async (req, res) => {
    try {
        await pool.execute(
            "DELETE FROM vehicles WHERE id = ?",
            [req.params.id]
        );

        req.flash('success_msg', 'Véhicule supprimé avec succès.');
        res.redirect('/vehicles');

    } catch (err) {
        console.error("Erreur lors de la suppression du véhicule:", err);
        req.flash('error_msg', 'Erreur lors de la suppression du véhicule.');
        res.redirect('/vehicles');
    }
});

// Route pour rechercher des véhicules / Route to search for vehicles
router.get('/search', async (req, res) => {
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const queryParams = [];

    if (req.query.brand) {
        query += ' AND brand = ?';
        queryParams.push(req.query.brand);
    }

    if (req.query.price) {
        query += ' AND price <= ?';
        queryParams.push(parseFloat(req.query.price)); // Convertir en nombre décimal / Convert to decimal
    }

    if (req.query.year) {
        query += ' AND year = ?';
        queryParams.push(parseInt(req.query.year)); // Convertir en entier / Convert to integer
    }
    // Log de la requête et des paramètres
    console.log("Requête SQL:", query);
    console.log("Paramètres:", queryParams);
    try {
        const [vehicles] = await pool.query(query, queryParams);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
res.setHeader('Pragma', 'no-cache');
res.setHeader('Expires', '0');

        res.json(vehicles);
    } catch (error) {
        console.error("Erreur lors de la récupération des véhicules:", error);
        res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
    }
});



router.get('/api/vehicles', async (req, res) => {
    try {
        const [vehicles, _] = await pool.query('SELECT * FROM vehicles');
        
        res.json(vehicles);
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des véhicules' });
    }
});

router.get('/api/brands', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT brand FROM vehicles');
        const brands = rows.map(row => row.brand);
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des marques.' });
    }
});
router.get('/api/years', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT year FROM vehicles');
        const years = rows.map(row => row.year);
        res.json(years);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des années.' });
    }
});

module.exports = router;
