const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/wine_whisper_api';

const wines_schema = 'CREATE TABLE wines(id SERIAL PRIMARY KEY, \
      recommended BOOLEAN, \
      name VARCHAR(40), \
      price smallint, \
      year smallint, \
      rating smallint, \
      company VARCHAR(40), \
      description text)';

// throw new Error("Something went badly wrong!");

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(wines_schema);
query.on('end', () => { client.end(); });