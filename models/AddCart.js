const mongoose = require('mongoose');

const AddCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Assuming you have a Product model
                required: true
            },
            quantity: {
                type: Number,
                min: 1,
                required: true
            }
        }
    ]
    
}, { timestamps: true });

module.exports = mongoose.model('Cart', AddCartSchema);