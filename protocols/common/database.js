const postgres = require('postgres')
const PGHOST = "database"; //for local development change to 127.0.0.1

// export const sql = postgres({ host: PGHOST, database: PGDATABASE, username: PGUSER, password: PGPASSWORD, port: 5432 });
const sql = postgres({
    host: PGHOST,
    database: 'websocket',
    username: 'root',
    password: 'root',
    port: 5432 // for local development change to 4000 
});


module.exports = {
    sql
}