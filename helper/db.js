const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect('mongodb+srv://adminMovie:1189038@movieapi.s5gb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

    mongoose.connection.on('open', () => {
      //  console.log("MongoDB: Connected");
    });
    mongoose.connection.on('error', (err) => {
        console.log("MongoDB: Not Connected", err);
    });

    mongoose.Promise = global.Promise; // mongoose içindeki global promise yapısı
}



