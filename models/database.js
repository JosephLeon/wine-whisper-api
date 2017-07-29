const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/wine_whisper_api';

const wines_schema = '
      id SERIAL PRIMARY KEY,
      recommended BOOLEAN,
      name VARCHAR(40) not null,
      price smallint,
      year smallint,
      rating smallint,
      company VARCHAR(40) not null,
      description text
      ';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE wines
    (
      id SERIAL PRIMARY KEY,
      recommended BOOLEAN,
      name VARCHAR(40) not null,
      price smallint,
      year smallint,
      rating smallint,
      company VARCHAR(40) not null,
      description text
    )
  ');
query.on('end', () => { client.end(); });