import mongoose from 'mongoose';

// Define item subdocument schema with tax details
const orderItemSchema = new mongoose.Schema({
    id: { type: String },
    type: { type: String },
    title: { type: String },
    useCase: { type: String },
    price: { type: Number }, // Tax-included price (from frontend)
    quantity: { type: Number, default: 1 },
    subtotal: { type: Number }, // price * quantity (without tax)
    tax: { type: Number }, // Tax amount for this item
    total: { type: Number } // Final price for this item
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    total: {
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
            unique: true
        },
        paymentIntentId: String,
        customerId: String
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'expired'],
        default: 'pending'
    },
    testMode: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
orderSchema.index({ 'stripe.sessionId': 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

// Clear any existing model to avoid OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;