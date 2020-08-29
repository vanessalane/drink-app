const router = require('express').Router();

router.get('/:id', (req, res) => {
    res.render('user', {
        hero_title: "author name"
    });
});

module.exports = router;