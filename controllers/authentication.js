const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

const generateToken = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret)
}

exports.signin = (req, res, next) => {
  // User has already had their email and password auth'd
  // we just need to five them a token
  res.send({ token: generateToken(req.user) });
}

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide name, email and passowrd'});
  }

  // See if a user with the given email exists
  User.findOne( { email: email }, (err, existingUser) => {
    if (err) { return next(err); }
    // If a user with email does exist; return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email already in use'} );
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      name: name,
      email: email,
      password: password
    });

    user.save((err) => {
      if (err) { return next(err); }

      // Respond to requiest indicating the user was created
      res.json({ token: generateToken(user) });
    });


  });
}