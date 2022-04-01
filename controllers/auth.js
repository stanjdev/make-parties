module.exports = function(app, model) {
  // SIGN UP FORM
  app.get('/sign-up', (req, res) => {
    res.render('sign-up-form');
  })

  // CREATE NEW ACCOUNT 
  app.post('/sign-up', (req, res) => {
    res.render('home', {msg: "sign up works"})
  })
  
  // LOGIN FORM
  app.get('/login', (req, res) => {
    res.render('login-form');
  })
  
  // LOG INTO ACCOUNT
  app.post('/login', (req, res) => {
    res.render('home', {msg: "login works"})
  })
}
