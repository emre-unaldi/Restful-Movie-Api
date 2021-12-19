const chai = require('chai'); 
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { set } = require('../../app');
const should = chai.should(); 

const server = require('../../app'); 

chai.use(chaiHttp);

let token, movieId;
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
                    movieId = res.body._id;
                    done();
                });
        });
    });

    describe('(/GET/:director_id movie)', () => {
        it('it should GET a movie by the given id', (done) => {
            chai.request(server)
                .get('/api/movies/' + movieId)  // üstteki post testinden elde ettiğimiz movieId yi kontrol için verdik
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
                    res.body.should.have.property('_id').eql(movieId); // id property si eşit olmalı bizim gönderdiğimiz id ye 
                    done();
                });
        });
    });

    describe('(/PUT/:director_id movie)', () => {
        it('it should UPDATE a movie given by id', (done) => {
            const movie = {
                title: '93RamizDayı',
                director_id: '61be2ec90a7d610ba2532348',
                category: 'Mafya',
                country: 'USA',
                year: 2020,
                imdb_score: 8
            };

            chai.request(server)
                .put('/api/movies/' + movieId)
                .send(movie)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    done();
                });
        });
    });

    describe('(/DELETE/:director_id movie)', () => {
        it('it should DELETE a movie given by id', (done) => {
            chai.request(server)
                .delete('/api/movies/' + movieId)
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(1);
                    done();
                });
        });
    });

});

