const petController = require('../controller/pet.controller')
const express = require('express')
const passportManager = require('../config/passport')
const router = express.Router()

router.get('/', passportManager.authenticate, (req, res, next) => {
    petController.get(req, res)
})
router.post('/', passportManager.authenticate, (req, res, next) => {
    petController.add(req, res)
})


module.exports = router