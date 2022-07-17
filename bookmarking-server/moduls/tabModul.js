const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TabSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        color: { type: String, required: true },
        userId: { type: String, required: true }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Tab', TabSchema);
