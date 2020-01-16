const mongoose = require('mongoose')
const Schema = mongoose.Schema

const petSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    type: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    submitDate: {
        type: Date,
        required: true
    },
    submittedBy: {
        type: String,
        required: true
    }
})

const model = mongoose.model('Pet', petSchema)

module.exports = model