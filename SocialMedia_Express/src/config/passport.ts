var JwtStrategy = require('passport-jwt').Strategy;
var CustomStrategy = require('passport-custom').CustomStrategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
import * as security from "./security"

import { DBManager } from "../dao/dbManager"


/**
* / config
*
* @function
*         Passport Strategy for verify Token JWT
*/



export default function(passport) {

  //Get Token for URl
  let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: security.secret.secret
  };

  //Check if user exist

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    DBManager.getDBMySQL().User.findOne(jwt_payload.username, function(user, err) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));

/*
  passport.use('custom', new CustomStrategy(
  function(req, done) {
    console.log(passport);
    done(null, true);
    User.findOne({
      username: req.body.username
    }, function (err, user) {
      done(err, user);
    });
  }
));
*/

};
