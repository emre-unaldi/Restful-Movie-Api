const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
    name: {
        type: String,
        maxlength: 40,
        minlength: 1
    },
    surname: {
        type: String,
        maxlength: 40,
        minlength: 1
    },
    bio: {
        type: String,
        maxlength: 1000,
        minlength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('director', DirectorSchema);
