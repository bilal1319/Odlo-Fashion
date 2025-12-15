import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
    },

    role: {
        type: String,
        enum: ['admin', 'User'],
        default: 'User',
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual field (NOT stored in DB)
userSchema.virtual("confirmPassword");

export default mongoose.model("User", userSchema);
