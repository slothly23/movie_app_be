const pool = require('../config/db'); // butuh konfigurasi database

module.exports = {
    //GET/api/movies
    getAll: async (req, res, next) => {
        try {
            //get all from movies
            const [rows] = await pool.execute(
                `SELECT *
                FROM movies 
                ORDER BY id DESC`
            );
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    getById : async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10); // desimal berbasis 10
            const [rows] = await pool.execute(
                `SELECT * FROM movies WHERE id = ?`, [id]
            );
            if(rows.length === 0) return res.status(404).json({ message: 'Movie tidak ditemukan' });
            res.json(rows[0]);
        } catch (error) {
            next(error);
        }
    },

    //POST /api/movies (protected)
    create: async (req, res, next) => {
        try {
            const { title, year, description } = req.body;
            // const userId = req.user ? req.user.id : null; // butuh mengenali siapa user nya

            const [result] = await pool.execute(`
                INSERT INTO movies (title, year, description) VALUES (?, ?, ?)`,
            [title, year || null, description || null]);
            
            res.status(201).json({ id: result.insertId, title, year: year || null, description: description || null});
        } catch (err) {
            next(err);
        }
    },

    //PUT /api/movies/:id (protected)
    update: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10); // desimal berbasis 10
            const { title, year, description } = req.body;

            const fields = [];
            const values = [];
            if (title !== undefined) { fields.push('title = ?'); values.push(title); } // pahami lagi syntax
            if (year !== undefined) { fields.push('year = ?'); values.push(year); }
            if (description !== undefined) { fields.push('description = ?'); values.push(description); }

            if (fields.length === 0) return res.status(400).json({message : 'Nothing to update'});

            values.push(id); // sekarang isinya apa?  => [{title: title}, {year: year}, {categoryId: categoryId}, {id: id}] => apa kebalikannya?
        
            const sql = `UPDATE movies SET ${fields.join(", ")} WHERE id = ?`;
            const [result] = await pool.execute(sql, values);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie tidak ditemukan'});
            res.json({ message: 'Movie diperbarui'});
        } catch (err) {
            next(err);
        }
    },

    //DELETE /api/movies/:id (protected)
    remove: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id, 10); // desimal berbasis 10
            const [result] = await pool.execute(`DELETE FROM movies WHERE id = ?`, [id]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Movie tidak ditemukan'});
            res.json({ message: 'Movie dihapus'});
        } catch (err) {
            next(err);
        }
    }
}