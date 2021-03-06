// Initialize express
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const models = require('./db/models');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const flash = require('express-flash');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = new session.MemoryStore;
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60) // 60 days

app.use(cookieParser("SECRET"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {expires: expiryDate},
  store: sessionStore,
  resave: false
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});


app.use(express.static('public'));

// Middleware
app.engine('handlebars', exphbs.engine({
  // Use "main" as our default layout
  defaultLayout: 'main', 
  // Allow access views to access using 'this.' keyword because of Handlebar's added security layer
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err)
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login')
      }
      req.user = user
      next(); // pass the execution off to whatever request the client intended
    })
  } else {
    next();
  }
});

app.use((req, res, next) => {
  // if a valid JWT is present
  if (req.user) {
    // Look up the user's record
    models.User.findByPk(req.user.id).then((currentUser) => {
      // make the user object available in all controllers and templates
      res.locals.currentUser = currentUser;
      console.log("currentUser", res.locals.currentUser)
      next();
    }).catch((err) => {
      console.log(err);
    })
  } else {
    next();
  }
});


// Use handlebars to render
app.set('view engine', 'handlebars');
require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);

// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
