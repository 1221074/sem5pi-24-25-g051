const mongoose = require('mongoose');

const allergySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Allergy', allergySchema);
