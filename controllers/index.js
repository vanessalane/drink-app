const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('homepage', {
        hero_title: "the drink app",
        hero_subtitle: "welcome"
    });
});

module.exports = router;