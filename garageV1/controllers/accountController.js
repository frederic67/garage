const Account = require('../models/account'); 

exports.addAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newAccount = await Account.create({ name, email, password });
    res.redirect('/accounts'); // Rediriger vers la liste des comptes / Redirect to account list
  } catch (error) {
    res.status(500).send('Erreur lors de l\'ajout du compte');
  }
};

exports.displayAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.render('displayAccounts', { accounts: accounts });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des comptes');
  }
};


