const express = require('express');
const path = require('path');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');

// setup express server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static((path.join(__dirname, 'public'))));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// use handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on connection to db and server
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}. Access locally at http://localhost:${PORT}`));
});