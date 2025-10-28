const mongoose = require('mongoose');

const roastSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    followers: {
        type: Number,
        required: true,
    },
    following: {
        type: Number,
        required: true,
    },
    like: {
        type: Number,
        required: true,
    },
    video: {
        type: Number,
        required: true,
    },
    roasting: {
        type: String,
        required: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Roast', roastSchema);