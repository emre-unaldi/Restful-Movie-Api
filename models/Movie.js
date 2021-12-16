const mongoose = require('mongoose'); // modülü dahil ediyoruz.
const Schema = mongoose.Schema; // mongoose altındaki schema nesnesini schema değişkenine atıyoruz.

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    category: String,
    country: String,
    year: Number,
    imdb_score: Number,
    createdAT: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);