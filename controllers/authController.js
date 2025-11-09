// untuk register dan config
const pool = require('../config/db'); // butuh konfigurasi database
const bycrpt = require('bcrypt'); // untuk hash password yg disimpan ke db
const jwt = require('jsonwebtoken');

require('dotenv').config(); // akses JWT_SECRET

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET belum di set di .env')
}

const SALT_ROUNDS = 10; // kayak jumlah ngacaknya gitu, salt seperti ditabur

module.exports = {
    //POST /api/auth/register
    register: async (req, res, next) => {
        try {
            const {email, password, name} = req.body; // **

            // --- validasi sederhana ---
            // jika ada yg kosong
            if(!email || !password) return res.status(400).json({ message: 'email dan password wajib'});
            //pass minimal 6 karakter
            if(password.length < 6) return res.status(400).json({ message: 'password minimal 6 karakter'});

            // cek apakah user sudah ada
            const [existing] = await pool.execute(`SELECT id FROM users WHERE email = ?`, [email]); // ? placeholder, nanti bisa diisi oleh email input **
            if (existing > 0) {
                return res.status(409).json({ message: 'email sudah terdaftar'});
            }

            //else bisa registrasi
            const hashed = await bycrpt.hash(password, SALT_ROUNDS); // password di hash diacak 2^10 sesuai salt round

            //insert user baru
            const [result] = await pool.execute(
                `INSERT INTO users (email, name, password) VALUES (?,?,?)`, [email, name || null, hashed]
            );

            const insertedId = result.insertId;
            return res.status(201).json({ id: insertedId, email, name: name || null});
        } catch (err) {
            next(err);
        }
    },

    //POST /api/auth/login
    login: async (req, res, next) => {
        try {
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({ message: 'email dan password wajib'});

            //ambil user 
            const [rows] = await pool.execute(
                `SELECT * FROM users WHERE email = ?`, [email]
            );
            if (rows.length === 0) return res.status(401).json({ message: 'invalid credentials'}); 

            const user = rows[0];

            //bandingkan password
            const match = await bycrpt.compare(password, user.password);
            if(!match) return res.status(401).json({ message: 'invalid credentials'});

            // sign JWT (jangan simpan pass di token)
            const payload = { id: user.id, email: user.email };
            const token = jwt.sign(payload, jwtSecret, {expiresIn: '1h'}); // 1h : 1 hour

            // menampilkan data jika berhasil
            return res.json({
                message: 'Login berhasil',
                token,
                user: {id: user.id, email: user.email, name: user.name}
            });
        } catch (err) {
            next(err);
        }
    }
}