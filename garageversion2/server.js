const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const multer = require('multer');
const upload = multer(); // utilise la mémoire comme stockage / use memory as storage

const methodOverride = require('method-override');
const morgan = require('morgan');


const { ensureAuthenticated } = require('./middlewares/middlewares');

// Configuration Passport
const passportConfig = require('./passport-config'); 
passportConfig(passport);

const app = express();
const port = 3000;

// Configuration d'EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());

// Utilisez body-parser pour analyser les données du formulaire / Use body-parser to parse form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Middleware de débogage / Debugging middleware
app.use((req, res, next) => {
    console.log("Corps de la requête: ", req.body);
    next();
});
app.use(morgan('dev'));
app.use(methodOverride('_method'));
// Ajout du log pour tester methodOverride / Added log to test methodOverride
app.use((req, res, next) => {
    console.log("Méthode après methodOverride: ", req.method);
    next();
});

// Configuration de la session et de Passport / Session and Passport configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes protégées / Protected roads
app.get('/admin', ensureAuthenticated, (req, res) => {
    res.render('admin', { user: req.user });
});

// Routeurs / Routers
const vehiclesRoutes = require('./routes/vehicles');
const testimonialsRoutes = require('./routes/testimonialRoutes');
const hoursRoutes = require('./routes/hoursRoutes');
const vehiclesOccasionRoute = require('./routes/vehiclesOccasion');
const authRoutes = require('./routes/authRoutes');
const accountsRouter = require('./routes/accounts');
const contactRoutes = require('./routes/contactRoutes');
const servicesRoute = require('./routes/services'); 
const servicesRouter = require('./routes/services');

// Intégration des routeurs / Router integration
app.use('/', servicesRoute);
app.use('/vehiclesOccasion', vehiclesOccasionRoute);
app.use('/api', accountsRouter);
app.use('/admin/vehicles', vehiclesRoutes);
app.use('/', testimonialsRoutes);
app.use('/', hoursRoutes);
app.use('/', authRoutes);
app.use('/', vehiclesRoutes); 
app.use('/services', servicesRouter);

app.use('/api/vehicles', vehiclesRoutes);

// Utilisez les routes de contact / Use contact routes
app.use(contactRoutes);

// Servez les fichiers statiques / Serve static files
app.use(express.static('public'));

// Gestionnaire d'erreurs global / Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue!');
});

// Ecoute du serveur / Listening to the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
