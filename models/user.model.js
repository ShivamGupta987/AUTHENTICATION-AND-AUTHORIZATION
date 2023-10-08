import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be at least 5 characters'],
        maxLength: [50, 'Name must be at most 50 characters'],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription:{
        id:String,
        status:String

        }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods = {
    generateJWTToken: function () {
        const token = jwt.sign(
            {
                id: this._id,
                email: this.email,
                subscription: this.subscription,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        );
        return token;
    },
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generatePasswordResetToken: async function () {
        const resetToken = crypto.randomBytes(20).toString('hex');
        
    this.forgotPasswordToken = crypto
    .createHadh('sha256')
    .update(resetToken)
    .digest('hex')
    ;
    this.forgotPasswordExpiry = Date.now()+ 15*60*1000; //15min from now

    return resetToken
    }

};

const User = model('User', userSchema);

export default User;
