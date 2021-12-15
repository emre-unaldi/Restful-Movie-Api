const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');

// Kayıtları listeleme enpointi 
router.get('/', (req, res) => {

  const promise = Movie.find({ });

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// kayıt ekleme endpointi 
router.post('/', (req, res, next) => {

  const movie = new Movie(req.body);  
  const promise = movie.save(); // veritabanını dışarı aktarma ve kontrolü için değişkene atandı

    promise.then((data) => { // değişken ile mongoose altındaki promise yapısı kullanıldı.
      res.json({ status: 1 });
    }).catch((err) => {
      res.json(err);
    });
});

module.exports = router; // yönlendirmeyi dışarı aktarma 