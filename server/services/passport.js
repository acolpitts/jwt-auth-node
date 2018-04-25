const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: "email" }
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) { return done(null, false); }

    // Compoare passwords
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};
// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  //  See if the user ID in the payload exists in the DB
  User.findById(payload.sub, (err, user) => {
    if (err) { return done(err, false) }

    if (user) {
      // if it does, call done with that user
      done(null, user);
    } else {
      // otherwise, call done without a user object
      done(null, false)
    }
  });
});

// Tell passport to use our custom strategies
passport.use(jwtLogin);
passport.use(localLogin);