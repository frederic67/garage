function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Veuillez vous connecter pour accéder à cette ressource.');
        res.redirect('/login');
    }
}

async function ensureAdmin(req, res, next) {
    try {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        } else {
            req.flash('error_msg', 'Seuls les administrateurs ont accès à cette page.');
            res.redirect('/login');
        }
    } catch (error) {
        req.flash('error_msg', 'Erreur lors de la vérification des droits d\'accès.');
        res.redirect('/login');
    }
}

module.exports = {
    ensureAuthenticated,
    ensureAdmin
    
};
