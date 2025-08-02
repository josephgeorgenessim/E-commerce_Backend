const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        trim: true,

    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: [true, 'Email must be unique'],
        lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    passwordResetCode: String,
    passwordResetCodeExpiresIn: Date,
    passwordResetCodeVerified: Boolean,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: Date,

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
})


// create model
const UserModel = mongoose.model('User', userSchema)


module.exports = UserModel;