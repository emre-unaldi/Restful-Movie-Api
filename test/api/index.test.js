const chai = require('chai'); 
const chaiHttp = require('chai-http');
const should = chai.should(); // should olmalı demektir.

const server = require('../../app'); // server imizi yani app.js dosyasımızı dahil ettik

chai.use(chaiHttp); // chaiHttp pluginini kullanılabilir hale getirdik

describe('Node Server', () => { 
    it('(GET /) returns the homepage', (done) =>  {
        chai.request(server) // chai ile servera bir request (istek) yapar
            .get('/')        // '/' direkt kök dizine gidecek yani localhost:3000 portuna gider.
            .end((err, res) => { // bu istek bittikten sonra 
                if (err)
                        throw err;
                res.should.have.status(200); // response edilen http inin 200 status koduna sahip olmalı demektir. 
                done();
            });
    });
});

/*
    - mocha ile testlerimizi çalıştırıcaz. chai ile assertion işlemlerimizi yapıcaz
    - describe ifadesi testin ne testi olduğunu belirtir, aslında bir açıklama gireriz.
    - her describe içinde birden fazla it() olabilir.Describeler bu it() leri kapsar ve bu 
    it() ler içinde de istediğimiz unit testi yapabiliriz.
    - done() ifadesi test bitti herşey yolunda sorun yok anlamına gelmektedir.

    "test": "mocha --exit --recursive"
        --exit testi çalıştırıp çıkış yapmasını sağlar.
        --recursive gecerli olan test dizini ve tüm alt dizinlerdeki test dosyalarını da teste tabi tutar.
*/
