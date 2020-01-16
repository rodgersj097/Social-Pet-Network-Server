const config = require('../config/jwtToken')
const User = require('../model/user')
const jwt = require('jsonwebtoken')

class Auth {
    signUp(req, res) {
        if (!req.query.username || !req.query.password) {
            res.json({ success: false, msg: "Please send username and password" })

        } else {
            console.log("Username not taken, Account creation Started")
            var newUser = new User({
                username: req.query.username,
                password: req.query.password
            });
            //save new user 
            newUser.save((err, user) => {
                if (err) {
                    return res.json({ success: false, msg: "User Creation failed : " + err })
                }
                return res.json({ success: true, msg: 'Succesfully created new user' + user })
            })
        }

    }

    signIn(req, res) {
        User.findOne({
            username: req.query.username
        }, (err, user) => {
            if (!user) {
                res.status(401).send({ success: false, msg: "Authentication failed, user not found" })
            } else {
                //check if password matches
                user.comparePassword(req.query.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        //if user is found and password matches create token 
                        var token = jwt.sign(user.toJSON(), config.secret, { expiresIn: '3600m' })
                            //return the information includeing token as JSON
                        res.json({ success: true, token: `JWT ${token}` })
                    } else {
                        res.status(401).send({ success: false, msg: 'Authentication failed, Wrong password' })
                    }
                })
            }
        })
    }
}

module.exports = new Auth()