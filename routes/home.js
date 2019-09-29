const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Genres Api',
        message: 'This is the homepage'
    });
});

module.exports = router;
