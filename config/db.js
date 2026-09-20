require('dotenv').config()
const { Pool } = require('pg') //this is a class from Pg, better for multiple requests

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'test' ? false : { rejectUnauthorized: false },
})

module.exports = pool
