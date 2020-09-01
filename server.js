const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers/');
const sequelize = require('./config/connection');

// setup express server
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.static((path.join(__dirname, 'public'))));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// set up express session
const sess = {
    secret: process.env.SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },  // session expires after 8 hours
    resave: false,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

// use handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}. Access locally at http://localhost:${PORT}`));
});