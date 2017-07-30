const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/wine_whisper_api';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Wine Whipser API' });
});

router.post('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {name: req.body.name, recommended: false, price: req.body.price, year: req.body.year, rating: req.body.rating, company: req.body.company, description: req.body.description};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO wines(name, recommended, price, year, rating, company, description) values($1, $2, $3, $4, $5, $6, $7)',
    [data.name, data.recommended, data.price, data.year, data.rating, data.company, data.description]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM wines ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// Read
router.get('/api/v1/wines', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM wines ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// Update
router.put('/api/v1/wines/:wine_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.wine_id;
  // Grab data from http request
  const data = {name: req.body.name, recommended: false, price: req.body.price, year: req.body.year, rating: req.body.rating, company: req.body.company, description: req.body.description};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE wines SET name=($1), recommended=($2), price=($3), year=($4), rating=($5), company=($6), description=($7) WHERE id=($8)',
    [data.name, data.recommended, data.price, data.year, data.rating, data.company, data.description, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM wines ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

// Local command line test
// recommended BOOLEAN, \
// name VARCHAR(40) not null, \
// price smallint, \
// year smallint, \
// rating smallint, \
// company VARCHAR(40) not null, \
// description text
// curl --data "name=test&recommended=false&price=1999&year=2016&rating=3&company=wine%20Company&description=light flavour" http://127.0.0.1:3000/api/v1/todos

module.exports = router;
