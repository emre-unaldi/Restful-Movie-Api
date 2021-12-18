const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/User');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


// register api nin altında değil direk olarak indexe yazacağız
// çünkü register için yetki almasına gerek yok, direkt kayıt yapabilir.
// kullanıcı kayıt endpointi
router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => { // 10 değeri şifreleme aralığıdır. hash değeri şifrelenmiş passwordu tutar
    const user = new User({
      username, // username = username demektir. modelimizdeki username ye body den gelen username aktarılır. bu şekilde yazmak es6 standartıdır.
      password: hash
    });
  
    const promise = user.save();
      promise.then((data) => {
        res.json(data);
      }).catch((err) => {
        res.json(err);
      });
  });
});

// login işlemini yapıp çıktı olarak token üreten endpoint
router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ // veritabanı sorgusu
    username // aranacak değer -> username: username demektir aslında ama es6 sayesinde bu şekilde yazabiliriz.
  }, (err, user) => {
    if (err)
      throw err;
    
    if(!user){ // usere yoksa
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }else{ // user varsa 
      bcrypt.compare(password, user.password).then((result) => { // 1.parametre kullanıcının girdiği servisten gelen password 
        if (!result){  // false dönerse                          // 2.parametre ise veritabanından gelen şifrelenmiş password
          res.json({                                             // resulttan şifre doğruluğuna göre true | false değer döner
            status: false,
            message: 'Authentication failed, wrong password.'
          });
        }else{ // true ise yani şifresi doğruysa 
          const payload = {
            username // username: username demek
          };
          // burda ise token ımızı oluşturuyoruz.
          const token = jwt.sign(payload, req.app.get('api_secret_key'), { // 1.parametre ile payloadımızı veriyoruz.
            expiresIn: 720 // 12 saat                                      // 2.parametre secret keyimiz
          });                                                              // 3.parametre  olarak ise tokena süre verebiliriz.

          res.json({ // oluşan tokenı json tipinde döndürdük
            status: true,
            token
          });
        }
      });
    }
  });

});

module.exports = router;
