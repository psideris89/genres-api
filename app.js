const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const auth = require('./middleware/auth');
const logger = require('./middleware/logger');
const home = require('./routes/home');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // optional configuration

// Middleware
app.use(express.json()); // Parses the body as json
app.use(express.urlencoded({ extended: true })); // Serves url unencoded request
app.use(express.static('public')); // Exposes files e.g. http://localhost:5000/readme.txt
app.use(helmet());

app.use('/', home);
app.use('/api/genres', genres);

// Configuration
debug(`Environment: ${process.env.NODE_ENV || app.get('env')}`);
debug(`Application Name: ${config.get('name')}`);
debug(`Mail Server: ${config.get('mail.host')}`);
debug(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); // Logging requests
    debug('Morgan Enabled');
}

app.use(logger);
app.use(auth);

app.listen(config.get('port'), () => {
    debug(`Listening on port ${config.get('port')}`);
});
