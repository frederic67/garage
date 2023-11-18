const Service = require('../models/service'); // Assurez-vous que c'est le bon chemin

exports.addService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newService = await Service.create({ name, description, price });
    res.redirect('/services'); // Rediriger vers la liste des services
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout du service');
  }
};

exports.displayServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.render('displayServices', { services: services });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des services');
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    // Utilisez la méthode update avec les nouvelles données
    await Service.update({ name, description, price }, { where: { id: id } });
    
    res.redirect('/services');
  } catch (error) {
    res.status(500).send('Erreur lors de la mise à jour du service');
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.destroy({ where: { id: id } });
    res.redirect('/services');
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression du service');
  }
};

