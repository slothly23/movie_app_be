require('dotenv').config();// load env
const mysql = require('mysql2/promise'); // biar bisa pake promise

console.log('DATABASE_URL:', process.env.DATABASE_URL); // lihat apakah url ke db ada

const dburl = process.env.DATABASE_URL || '';
if (!dburl) {
    throw new Error('DATABASE_URL belum di set di .env')
}
const url = new URL(dburl); // kalau sudah ada dburl, tampung di variabel url

// best practice
// buat pool : kumpulan koneksi?
const pool = mysql.createPool({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//,''), // kalau ketemu "/" bisa diganti jadi kosong
    port: url.port ? Number(url.port) : 3306, // cek port ada?, kalau tidak set ke 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
// yg pake pool biasanya controller => buat CRUD