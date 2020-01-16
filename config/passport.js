const jwtSecret = require('./jwtToken')
const User = require('../model/user')
const passport = require('passport')
const Strategy = require("passport-jwt").Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const config = require('./jwtToken')

class passportManager {
    initialize() {

        var opts = {
            jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: config.secret
        }

        passport.use(new Strategy(opts, function(jwt_payload, done) {
            User.findOne({ id: jwt_payload.id }, function(err, user) {
                if (err) {
                    return done(err, false)

                }
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            })
        }))
        return passport.initialize()
    }
    authenticate(req, res, next) {
        try {
            passport.authenticate('jwt', { session: false }, (err, user, info) => {
                if (err) { return next(err) }
                if (!user) {
                    if (info.name === "TokenExpiredError") {
                        return res.status(401).json({ message: "Your token has expired" })
                    } else {
                        return res.status(401).json({ message: info.message })
                    }
                }
                req.user = user
                return next()
            })(req, res, next)
        } catch (err) {
            res.json({ msg: err })
        }
    }
}
module.exports = new passportManager()