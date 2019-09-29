const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
    { id: 1, name: 'Rock' },
    { id: 2, name: 'Pop' },
    { id: 3, name: 'Funky' },
    { id: 4, name: 'Jazz' }
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = { id: genres.length + 1, name: req.body.name };
    genres.push(genre);
    res.send(genre);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id == req.params.id);
    if (!genre) return res.status(404).send('Genre with ID not found');
    res.send(genre);
});

router.put('/:id', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = genres.find(c => c.id == req.params.id);
    if (!genre) return res.status(404).send('Genre with ID not found');

    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
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

module.exports = router;
