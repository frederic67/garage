const express = require('express');
const router = express.Router();
const pool = require('../database');  
router.get('/', async (req, res) => {
    try {
        const [approvedTestimonials] = await pool.query('SELECT * FROM testimonials WHERE approved = TRUE');
        res.render('index', { approvedTestimonials });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des témoignages');
    }
});

module.exports = router;
