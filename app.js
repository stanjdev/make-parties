// Initialize express
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const models = require('./db/models');

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


// OUR MOCK ARRAY OF PROJECTS
var events = [
  { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnR8ZW58MHx8MHx8&w=1000&q=80" },
  { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnR8ZW58MHx8MHx8&w=1000&q=80" },
  { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnR8ZW58MHx8MHx8&w=1000&q=80" }
]

// INDEX
app.get('/', (req, res) => {
  models.Event.findAll({ order: [['createdAt', 'DESC']] }).then((events) => {
    res.render('events-index', { events: events });
  })
})

// NEW
app.get('/events/new', (req, res) => {
  res.render('events-new', {});
})

// CREATE
app.post('/events', (req, res) => {
  models.Event.create(req.body).then((event) => {
    res.redirect(`/events/${event.id}`);
  }).catch((err) => {
    console.log(err);
  });
})

// SHOW
app.get('/events/:id', (req, res) => {
  // Search for the event by its id that was passed in via req.params
  models.Event.findByPk(req.params.id).then((event) => {
    // If the id is for a valid event, show it
    res.render('events-show', { event: event })
  }).catch((err) => {
    // if the id is not in our db, log an error
    console.log(err.message);
  })
})




// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
