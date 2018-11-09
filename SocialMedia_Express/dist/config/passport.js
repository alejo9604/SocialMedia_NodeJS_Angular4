"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JwtStrategy = require('passport-jwt').Strategy;
var CustomStrategy = require('passport-custom').CustomStrategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const security = require("./security");
const dbManager_1 = require("../dao/dbManager");
function default_1(passport) {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: security.secret.secret
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        dbManager_1.DBManager.getDBMySQL().User.findOne(jwt_payload.username, function (user, err) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        });
    }));
}
exports.default = default_1;
;
