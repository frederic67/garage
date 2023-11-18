const Hours = require('../models/hours'); // Ajustez le chemin selon votre structure
const HoursController = require('../controllers/hoursController');


exports.getHours = async (req, res) => {
  try {
    const hours = await Hours.findAll();
    res.render('updateHours', { hours: hours });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des horaires');
  }
};

exports.updateHours = async (req, res) => {
  try {
    const { day, openTime, closeTime } = req.body;
    await Hours.upsert({ 
        day: day, 
        openTime: openTime, 
        closeTime: closeTime 
    });
    res.redirect('/hours'); // Redirige vers la page d'horaires (vous pouvez ajuster selon votre besoin)
  } catch (error) {
    res.status(500).send('Erreur lors de la mise à jour des horaires');
  }
};
