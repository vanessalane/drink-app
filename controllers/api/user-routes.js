const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users  WORKING
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

// GET .api/users/1  WORKING
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

//POST /api/user
// This route adds a new user.  WORKING
// Required Body
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
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// // login route WORKING
// {
//      "email": "testytest1@gmail.com", 
//      "password": "tester_1"
// }
// This gets you a 200 respose
router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'your login credentials are not correct' });
        return;
      }
  
      const validPassword = dbUserData.password;
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
    
//PUT /api/user/1
// This route changes the password
// WORKING
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

//DELETE / api/user/1  WORKING
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
