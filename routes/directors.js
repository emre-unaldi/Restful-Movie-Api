const express = require('express');
const router = express.Router();

// Models
const Director  = require('../models/Director');

// Director kayıt ekleme endpointi
router.post('/', (req, res) => {
   const director = new Director(req.body);
   const promise = director.save();

       promise.then((data) => {
           res.json(data);
       }).catch((err) => {
           res.json(err);
       });
});


// Directors-Movies join ile birleştirip tüm directorleri listeleme
router.get('/', (req, res) => {
    const promise = Director.aggregate([ // join işlemi için 
        {
            $lookup: {
                from: 'movies', // nereyle join edileceği
                localField: '_id', // directors hangi alanla eşleştirilecek
                foreignField: 'director_id', // movies hangi alanla eşleştirilecek
                as: 'movies' // gösterilmek için hangi değişkene atanacak
            }
        },
        {
            $unwind: {
                path: '$movies', // yukarda oluşturulan datayı kullanmak için almalıyız.
                preserveNullAndEmptyArrays: true // ilişkisi bulunmayan kayıtlar ıda gösterir.
            }
        },
        {
            $group: { 
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: { // movies değişkeni altında ne kadar kaydı varsa tek director kaydında göstersin
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'

            }
        }
    ]);

        promise.then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        });
});


















module.exports = router;