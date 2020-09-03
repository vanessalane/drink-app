const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and fun .findAll() method
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET .api/users/1
router.get('/:user_id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            user_id: req.params.user_id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
// This route adds a new user.
// Required body:
// {
//     "username": "bobby_boi", 
//     "email": "BigBob@bobmail.com",
//     "password": "bobbyRULEZ"
// }
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.user_id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;

          res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
   });
});

// POST /api/users/login
// Required body:
// {
//     "email": "BigBob@bobmail.com",
//     "password": "bobbyRULEZ"
// }
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'Email address provided does not match an existing account.' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.user_id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in.' });
        });
    });
});

// POST /api/users/logout
// no body necessary
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
      req.session.destroy(() => {
          res.status(204).end();
      });
  }
  else {
      res.status(404).end();
  }
});

// PUT /api/users/1
// Body can include the following
// {
//     "username": "bobby_boi", 
//     "email": "BigBob@bobmail.com",
//     "password": "bobbyRULEZ"
// }
// This gets you a 200 respose
router.put('/:id', (req, res) => {
    User.update (req.body, {
        individualHooks: true,
        where: {
            user_id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE / api/user/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            user_id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.statusCode(404).json({ message: 'No user found with this id' })
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.statusCode(500).json(err);
    });
});

module.exports = router;
