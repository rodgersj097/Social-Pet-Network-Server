const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/user');

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(req.body)
        if (err) { return next(err) }
        if (!user) {
            console.log(info)
            return res.send({ message: "User information incorrect" }) //res.redirect('/login')
        }
        req.logIn(user, function(err) {
            if (err) { return next(err) }
            return res.send({ message: "User logged in" }) //res.redirect('/')// res.redirect('/users' + user.username)
        })
    })(req, res, next)
})

router.post('/register', (req, res, next) => {
    console.log('starting register')
    User.register(
        new User({ username: req.query.username, email: req.query.email }),
        req.query.password,
        function(err, account) {
            if (err) {
                console.log(err)
                return res.send({ message: "User registered" }) // res.render('login', { account: account })
            }

            passport.authenticate('local')(req, res, function() {
                res.send({ message: "User registered" })
            })
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
})

module.exports = router;