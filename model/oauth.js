const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return this.loginType === 'manual';
        }
    },
    name: {
        type: String,
        required: true
    },
    loginType: {
        type: String,
        enum: ['manual', 'oauth'],
        required: true
    },
    googleId: {
        type: String,
        required: function() {
            return this.loginType === 'oauth';
        }
    },
}, {
    timestamps: true
});

// Hash password before saving for manual login
userSchema.pre('save', async function(next) {
    if (this.loginType === 'manual' && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password for manual login
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (this.loginType !== 'manual') return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);