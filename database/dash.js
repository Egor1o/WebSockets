const postgres = require('postgres')
const PGHOST = "127.0.0.1";

// export const sql = postgres({ host: PGHOST, database: PGDATABASE, username: PGUSER, password: PGPASSWORD, port: 5432 });
const sql = postgres({
    host: PGHOST,
    database: 'websocket',
    username: 'root',
    password: 'root',
    port: 4000
});


module.exports = {
    sql
}