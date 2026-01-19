import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Document will be automatically deleted after 5 minutes (300 seconds)
    }
});

// Hash OTP before saving
otpSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare OTP
otpSchema.methods.compareOTP = async function (candidateOTP) {
    return await bcrypt.compare(candidateOTP, this.otp);
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
