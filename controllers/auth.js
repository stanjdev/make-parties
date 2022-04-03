const jwt = require('jsonwebtoken');

function generateJWT(user) {
  const mpJWT = jwt.sign({ id: user.id }, "AUTH-SECRET", {expiresIn: 60*60*24*60});
  return mpJWT;
}

module.exports = function(app, models) {
  // SIGN UP FORM
  app.get('/sign-up', (req, res) => {
    res.render('sign-up-form');
  })

  // CREATE NEW ACCOUNT 
  app.post('/sign-up', (req, res) => {
    models.User.create(req.body).then((user) => {
      // After creating the user
      const mpJWT = generateJWT(user);
      // save as cookie
      res.cookie("mpJWT", mpJWT);
      console.log('user created!!!', user)
      // redirect to the root route
      res.redirect("/");
    }).catch((err) => {
      console.log(err);
    })
  })
  
  // LOGIN FORM
  app.get('/login', (req, res) => {
    res.render('login-form');
  })
  
  // LOG INTO ACCOUNT
  
  app.post('/login', (req, res, next) => {
    // look up user with email
    models.User.findOne({ where: { email: req.body.email } }).then((user) => {
      // compare passwords
      user.comparePassword(req.body.password, function(err, isMatch) {
        // if not match, send back to login
        console.log("login pw:", req.body.password)
        if (!isMatch) {
          console.log('mismatch!!!')
          return res.redirect('/login');
        }
        // if it is match, generate JWT
        const mpJWT = generateJWT(user);
        // save jwt as cookie
        res.cookie("mpJWT", mpJWT);
        res.redirect('/');
      })
    }).catch((err) => {
      // if can't find user, return to login
      console.log("LOGIN ERRORR", err)
      return res.redirect('/login');
    });
  });

  // LOGOUT
  app.get('/logout', (req, res, next) => {
    res.clearCookie('mpJWT');

    // req.session.sessionFlash = { type: 'success', message: 'Successfully logged out!' }
    // comment the above line in once you have error messaging setup (step 15 below)
    return res.redirect('/');
  })
};
