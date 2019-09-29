const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const Joi = require('joi');
const logger = require('./logger');
const auth = require('./auth');
const app = new express();

// Middleware
app.use(express.json()); // Parses the body as json
app.use(express.urlencoded({ extended: true })); // Serves url unencoded request
app.use(express.static('public')); // Exposes files e.g. http://localhost:5000/readme.txt
app.use(helmet());
app.use(morgan('tiny')); // Logging requests

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

const port = process.env.PORT || '5000';
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
