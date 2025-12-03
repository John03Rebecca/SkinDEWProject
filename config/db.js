// config/db.js
const mysql = require("mysql2/promise");

const url = process.env.MYSQL_URL;
if (!url) {
  throw new Error("MYSQL_URL missing. Set it in Railway -> SkinDEWProject -> Variables.");
}

const pool = mysql.createPool(url);

module.exports = pool;

