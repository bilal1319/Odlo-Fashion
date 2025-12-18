import mongoose from 'mongoose';

// Define item subdocument schema explicitly
const orderItemSchema = new mongoose.Schema({
    id: { type: String },
    type: { type: String },
    title: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    items: [orderItemSchema],
    amountPaid: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true
    },
    stripe: {
        sessionId: {
            type: String,
            required: true,
            unique: true
        },
        paymentIntentId: String,
        customerId: String
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    testMode: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
orderSchema.index({ 'stripe.sessionId': 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ createdAt: -1 });

// Clear any existing model to avoid OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
