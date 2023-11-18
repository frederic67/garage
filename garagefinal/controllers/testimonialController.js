const Testimonial = require('../models/testimonial'); 
exports.addTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;
    await Testimonial.create({ name, message });
    res.redirect('/testimonials'); // Redirige vers la liste des témoignages / Redirects to the list of testimonials
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout du témoignage');
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ where: { isApproved: true } });
    res.render('displayTestimonials', { testimonials: testimonials });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des témoignages');
  }
};

exports.approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.update({ isApproved: true }, { where: { id: id } });
    res.redirect('/testimonials');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'approbation du témoignage');
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.destroy({ where: { id: id } });
    res.redirect('/testimonials');
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression du témoignage');
  }
};
