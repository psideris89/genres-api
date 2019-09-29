const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const Joi = require('joi');
const logger = require('./logger');
const auth = require('./auth');
const app = new express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// If the NODE_ENV is not defined then the env has default value development
// console.log(`app: ${app.get('env')}`);

// Middleware
app.use(express.json()); // Parses the body as json
app.use(express.urlencoded({ extended: true })); // Serves url unencoded request
app.use(express.static('public')); // Exposes files e.g. http://localhost:5000/readme.txt
app.use(helmet());

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

const genres = [
    { id: 1, name: 'Rock' },
    { id: 2, name: 'Pop' },
    { id: 3, name: 'Funky' },
    { id: 4, name: 'Jazz' }
];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id == req.params.id);
    if (!genre) return res.status(404).send('Genre with ID not found');
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = { id: genres.length + 1, name: req.body.name };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = genres.find(c => c.id == req.params.id);
    if (!genre) return res.status(404).send('Genre with ID not found');

    genre.name = req.body.name;
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id == req.params.id);
    if (!genre) return res.status(404).send('Genre with ID not found');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.status(204).end();
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string()
            .min(3)
            .required()
    };
    return Joi.validate(genre, schema);
}

app.listen(config.get('port'), () => {
    debug(`Listening on port ${config.get('port')}`);
});
