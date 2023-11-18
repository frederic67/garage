const express = require('express');
const router = express.Router();
const pool = require('../database');  
const path = require('path');
// Route GET pour afficher le formulaire d'ajout de témoignage / GET route to display the add testimonial form
router.get('/add', (req, res) => {
    res.render('addTestimonial');  
});

// Route POST pour soumettre le témoignage depuis l'interface d'administration / POST route to submit the testimonial from the admin interface
router.post('/admin/testimonials/add', async (req, res) => {
    const { name, comment, rating } = req.body;
    
    try {
        await pool.query('INSERT INTO testimonials (name, comment, rating, approved) VALUES (?, ?, ?, FALSE)', [name, comment, rating]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur lors de l\'ajout du témoignage' });
    }
});



// Récupérer tous les témoignages (pour les employés) / Retrieve all testimonials (for employees)
router.get('/admin/testimonials', async (req, res) => {
    try {
        const [testimonials, fields] = await pool.query('SELECT * FROM testimonials');
        res.render('displayTestimonials', { testimonials, isAdmin: req.user.role === 'admin' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des témoignages');
    }
});

// Approuver un témoignage / Approve a testimonial
router.post('/admin/testimonials/:id/approve', async (req, res) => {
    try {
        await pool.query('UPDATE testimonials SET approved = TRUE WHERE id = ?', [req.params.id]);
        res.redirect('/admin/testimonials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'approbation du témoignage');
    }
});

// Supprimer un témoignage / Delete a testimonial
router.post('/admin/testimonials/:id/delete', async (req, res) => {
    try {
        await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
        res.redirect('/admin/testimonials');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la suppression du témoignage');
    }


});
router.get('/admin/testimonials/add', (req, res) => {
    res.render('addTestimonials');
});

router.get('/approved', async (req, res) => {
    try {
        const [approvedTestimonials] = await pool.query('SELECT * FROM testimonials WHERE approved = TRUE');
        res.json(approvedTestimonials);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des témoignages' });
    }
});
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


module.exports = router;
