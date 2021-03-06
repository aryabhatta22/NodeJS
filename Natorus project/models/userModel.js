const crypto = require('crypto')
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
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


userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre(/^find/, function(next) {
    // this points to the current query and we do want to see users with account set as active
    this.find({active: {$ne: false}})
    next();
});

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

userSchema.methods.changePasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;