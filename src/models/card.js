const mongoose = require('mongoose');
const { Schema } = mongoose;

const CardSchema = new Schema({
    type: { type: String, required: true },
    content: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', CardSchema, 'cards');