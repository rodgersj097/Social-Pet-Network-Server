const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new schema({
    username: {
        type: String,
        unique: true,
        required: true

    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})



userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}
module.exports = mongoose.model('User', userSchema)