// Initialize express
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const models = require('./db/models');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Middleware
app.engine('handlebars', exphbs.engine({
  // Use "main" as our default layout
  defaultLayout: 'main', 
  // Allow access views to access using 'this.' keyword because of Handlebar's added security layer
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

// Use handlebars to render
app.set('view engine', 'handlebars');
require('./controllers/events')(app, models);

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
