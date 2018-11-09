/*
import * as jwt from "jwt-simple";
import { User } from "../models/user";
import * as security from "./security"

export function getToken(user) {
    return jwt.sign(user, security.secret.secret, {
        expiresIn: 3600
    });
};

export function verifyOrdinaryUser(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, security.secret.secret, function (err, decoded) {
            if (err) {
                //let err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        let err = new Error('No token provided!');
        //err.status = 403;
        return next(err);
    }
};
*/
