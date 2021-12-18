const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;
    // bu token header olarak gelebilir, bir post bodysinden gelebilir veya bir get queryisinden gelebilir.

    if(token){ // token varsa 
        // verify ederiz, doğrularız.
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
        // 1.parametre gelen token değeri
        // 2.parametre ise secret key imiz
        // 3.parametre callback fonksiyon yazcaz.
        // Fonksiyonumuzda 1.parametre olarak error 2.parametre olarak ise decoded edilmiş data
            if (err){ // hata varsa 
                res.json({
                    satus: false,
                    message: 'Failed to authenticate token.' // token gecersizse
                });
            }else{ // hata yoksa 
                req.decode = decoded; // requestime decode edilmiş şifreyi koymamız gerekir
                console.log(decoded);
                next(); // herşey yolunda artık herhangi bir route ile eşleşebilir, erişim açık
            }
        });
    }else{ // token yoksa 
        res.json({
            status: false,
            message: 'No token provided.' // herhangi bir token sağlanmadı diye json çıktı veririz
        });
    }
}; 