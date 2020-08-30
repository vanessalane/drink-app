const router = require('express').Router();

router.get('/:id', (req, res) => {
    res.render('recipe', {
        hero_title: "recipe name",
        hero_subtitle: "author name"
    });
});

module.exports = router;