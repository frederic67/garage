const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const path = require('path');
const pool = require('../database');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        // Récupérer les véhicules d'occasion de la base de données / Retrieve used vehicles from database
        const [vehicles, fields] = await pool.query("SELECT * FROM vehicles");

        res.render('displayVehiclesOccasion', { vehicles, isAdmin: req.user.role === 'admin' });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la récupération des véhicules");
    }
});

router.get('/add', (req, res) => {
    res.render('addVehiclesOccasion');
});

router.post('/add', upload.single('vehicleImage'), async (req, res) => {
    const { brand, model, year, price, description, mileage } = req.body;
    const image_url = '/uploads/' + req.file.filename;

    try {
        await pool.query("INSERT INTO vehicles (brand, model, year, price, description, image_url, mileage) VALUES (?, ?, ?, ?, ?, ?, ?)", [brand, model, year, price, description, image_url, mileage]);
        res.redirect('/vehiclesOccasion');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'ajout du véhicule");
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const vehicleId = req.params.id;
        
        const [vehicles] = await pool.query("SELECT * FROM vehicles WHERE id = ?", [vehicleId]);

        if (vehicles.length === 0) {
            return res.status(404).send("Véhicule non trouvé.");
        }

        res.render('editVehiclesOccasion', { vehicle: vehicles[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la récupération des informations du véhicule.");
    }
});

router.post('/edit/:id', upload.single('vehicleImage'), async (req, res) => {
    const vehicleId = req.params.id;
    const { brand, model, year, price, description, mileage } = req.body;
    let image_url = req.body.currentImage;  // Si l'image n'est pas mise à jour, conservez l'ancienne / If the image is not updated, keep the old one

    if (req.file) {
        image_url = '/uploads/' + req.file.filename;  // Mettez à jour l'URL de l'image si une nouvelle image est fournie / Update the image URL if a new image is provided
    }

    try {
        await pool.query("UPDATE vehicles SET brand = ?, model = ?, year = ?, price = ?, description = ?, image_url = ?, mileage = ? WHERE id = ?", [brand, model, year, price, description, image_url, mileage, vehicleId]);
        res.redirect('/vehiclesOccasion');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la mise à jour du véhicule.");
    }
});

module.exports = router;
