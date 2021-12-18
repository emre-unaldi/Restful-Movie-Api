const chai = require('chai'); 
const chaiHttp = require('chai-http');
const should = chai.should(); 

const server = require('../../app'); 

chai.use(chaiHttp);

let token;
// testler başlamadan önce tokenı almamız gerekiyor bu yüzden 
// before keywordü ile testler başlamadan önce işlem yapabiliyoruz.

describe('/api/movies tests', () => { 
    before((done) => {
        chai.request(server)
            .post('/authenticate')
            .send({ username: 'eunaldi', password: '1189038' })
            .end((err, res) => {
                token = res.body.token;
                //console.log("Token = " + token);
                done();
            });
    });

    describe('/GET movies', () => {
        it('it should GET all the movies', (done) => {
            chai.request(server)
                .get('/api/movies') // get isteğinde bulunuldu.
                .set('x-access-token', token)   // aldığımız token değerini set diyerek header ile verdik.
                .end((err, res) => {
                    res.should.have.status(200);  // dönen http protokolü status değeri 200 olmalı demek 
                    res.body.should.be.a('array'); // dönen body değeri bir array olmalı demek - should.be.a('array')
                    done();
                });
        });
    });

});

