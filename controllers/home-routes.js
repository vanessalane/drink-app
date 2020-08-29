const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('homepage', {
        nav_content_label: "recipes",
        hero_eyebrow: "it's time to",
        hero_title: "drink app"
    });
});

module.exports = router;