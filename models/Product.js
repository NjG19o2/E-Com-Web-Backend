const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if (value <  0) {
                throw new Error('Price cannot be less than zero');
            }
        }
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true
    },
    SKU: {
        type: String,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    // Additional fields for product details
    brand: {
        type: String,
        required: false,
        trim: true
    },
    color: {
        type: String,
        required: false,
        trim: true
    },
    size: {
        type: String,
        required: false,
        trim: true
    },
    weight: {
        type: Number,
        required: false
    },
    dimensions: {
        width: {
            type: Number,
            required: false
        },
        height: {
            type: Number,
            required: false
        },
        depth: {
            type: Number,
            required: false
        }
    },
    // ... any other product detail fields you want to include
}, { timestamps: true });

module.exports = mongoose.model('ProductDetails', productDetailsSchema);