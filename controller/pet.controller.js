const pet = require('../model/pets.models')
class petController {
    async add(req, res) {

        if (req.user && req.user.username) {
            const newPet = new pet({
                name: req.body.name,
                type: req.body.type,
                breed: req.body.breed,
                submitDate: req.body.submitDate,
                submittedBy: req.body.submittedBy

            })
            try {
                let result = await newPet.save()
                res.json({ success: true, msg: "New pet is created succesfully" })

            } catch (err) {
                return res.json({ success: false, msg: 'Save project failed ' + err })

            }
        } else {
            return res.status(403).send({ success: false, msg: 'Unauthorized' })
        }
    }
    async get(req, res) {
        if (req.user && req.user.username) {
            try {
                let pets = await pet.find({ submittedBy: req.user.username }).lean().exec()
                console.log(pets)
                return res.json(pets)
            } catch (err) {
                return next(err)
            }
        } else {
            return res.status(403).send({ success: false, msg: "Unauthorized" })
        }
    }
}

module.exports = new petController()