const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us you name']
    },
    email: {
        type: String,
        required: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm the password.'],
        validate: {
            // This only works on CREATE and SAVE!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
    // If password is not modified
    if(!this.isModified('password'))
        return next();
    
    
    this.password = await bcrypt.hash(this.password, 12);
    
    // delete the passwordConfirm
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;