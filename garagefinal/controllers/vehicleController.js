const Vehicle = require('../models/vehicles'); 

exports.addVehicle = async (req, res) => {
  try {
    const { brand, model, year, price } = req.body;
    const newVehicle = await Vehicle.create({ brand, model, year, price });
    res.redirect('/vehicles'); // Rediriger vers la liste des véhicules / Redirect to vehicle list
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout du véhicule');
  }
};

exports.displayVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.render('displayVehicles', { vehicles: vehicles });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des véhicules');
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { brand, model, year, price } = req.body;
    const updatedVehicle = await Vehicle.update({ brand, model, year, price }, {
      where: { id: req.params.id }
    });
    res.redirect('/vehicles'); // Rediriger vers la liste des véhicules / Rediriger vers la liste des véhicules
  } catch (error) {
    res.status(500).send('Erreur lors de la mise à jour du véhicule');
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.destroy({
      where: { id: req.params.id }
    });
    res.redirect('/vehicles'); // Rediriger vers la liste des véhicules / Rediriger vers la liste des véhicules
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression du véhicule');
  }
};
