const chai = require('chai'); 
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { set } = require('../../app');
const should = chai.should(); 

const server = require('../../app'); 

chai.use(chaiHttp);

let token;
// testler başlamadan önce tokenı almamız gerekiyor bu yüzden 
// before keywordü ile testler başlamadan önce işlem yapabiliyoruz.

describe('(/api/movies tests)', () => { 
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

    describe('(/GET movies)', () => {
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

    describe('(/POST movie)', () => {
        it('it should POST a movie', (done) => {
            const movie = {
                title: 'Ramiz Dayı',
                director_id: '61be2ec90a7d610ba2532347',
                category: 'Kabadayı',
                country: 'Türkiye',
                year: 2021,
                imdb_score: 9
            };

            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    done();
                });
        });
    });


});

