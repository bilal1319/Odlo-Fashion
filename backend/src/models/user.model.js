import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: function() {
            return this.authType === 'email';
        },
        minlength: [6, "Password must be at least 6 characters"]
    },
    role: {
        type: String,
        enum: ['admin', 'collaborator', 'user'],
        default: 'collaborator',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    authType: {
        type: String,
        enum: ['email', 'google'],
        default: 'email',
    },
});
userSchema.virtual("confirmPassword");

export default mongoose.model("User", userSchema);
