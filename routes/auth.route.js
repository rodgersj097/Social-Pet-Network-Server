const authController = require('../controller/auth.controller')
const express = require('express')
const router = express.Router()

router.post('/signup', authController.signUp)
router.post('/signin', authController.signIn)

module.exports = router