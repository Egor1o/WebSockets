const postgres = require('postgres')
const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
const DB_PORT = process.env.DB_PORT ?? 4000

// export const sql = postgres({ host: PGHOST, database: PGDATABASE, username: PGUSER, password: PGPASSWORD, port: 5432 });
const sql = postgres({
    host: DB_HOST,
    database: 'websocket',
    username: 'root',
    password: 'root',
    port: DB_PORT
});


module.exports = {
    sql
}