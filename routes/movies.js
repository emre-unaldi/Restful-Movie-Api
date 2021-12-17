const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');


// Movies tüm kayıtları listeleme enpointi 
router.get('/', (req, res) => {
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind: '$director'
    }
  ]);

    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
});


// Movies Top 10 listesi - :movie_id olan get routerı ile çakışmamamsı için onun üstüne yazdık.
router.get('/top10', (req, res) => {
  const promise = Movie.find({ }).limit(10).sort({ imdb_score: 1 });

    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
});
 

// Movies kayıt ekleme endpointi 
router.post('/', (req, res, next) => {
  const movie = new Movie(req.body);  
  const promise = movie.save(); // veritabanını dışarı aktarma ve kontrolü için değişkene atandı

    promise.then((data) => { // değişken ile mongoose altındaki promise yapısı kullanıldı.
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
});


// Movies verilen id ye göre kayıt getirme endpointi
router.get('/:movie_id', (req, res, next) => {
    const promise = Movie.findById(req.params.movie_id);

    promise.then((movie) => {
      res.json(movie);
    }).catch((err) => {
      res.json(err)
    })
});


// Movies verilen id ye göre kayıt güncelleme endpointi
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new: true  // direk olarak güncel data yı ekrana verir.
    }
  );

    promise.then((movie) => {
      res.json(movie);
    }).catch((err) => {
      res.json(err);
    });
});


// Movies verilen id ye göre kayıt silme endpointi
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

    promise.then(() => {
      res.json({ status: 1 });
    }).catch((err) => {
      res.json(err);
    });
});


// Movies iki yıl arasındaki kayıtları listeleme - Between 
router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
      // $gte operatörü -> büyük veya eşit anlamına gelir.
      // $lte operatörü -> küçük veya eşit anlamına gelir.
    }
  );

    promise.then((movie) => {
      res.json(movie);
    }).catch((err) => {
      res.json(err);
    });
});

module.exports = router; // yönlendirmeyi dışarı aktarma 
