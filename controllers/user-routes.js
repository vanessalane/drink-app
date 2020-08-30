const router = require('express').Router();

router.get('/login', (req, res) => {
    res.render('login', {
        hero_eyebrow: "log in"
    });
});

router.get('/:id', (req, res) => {
    res.render('user', {
        hero_title: "author name"
    });
});

module.exports = router;