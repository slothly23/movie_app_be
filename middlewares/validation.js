module.exports = {
    validateCategoryCreate : (req, res, next) => {
        const {name} = req.body;
        const errors = [];

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            errors.push('name wajib (minimal 2 karakter)');
        }
        if (errors.length) {
            return res.status(400).json({ errors });
        }
        next();
    },

    validateCategoryUpdate : (req, res, next) => {
        const {name} = req.body;
        const errors = [];

        if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
            errors.push('Jika disertakan, name minimal 2 karakter');
        }

        if (errors.length) {
            return res.status(400).json({ errors });
        }
        next();
    },

    validateMovieCreate : (req, res, next) => {
        const {title, year} = req.body; // yg wajib diisi dari body
        const errors = [];

        if (!title || typeof title !== 'string' || title.trim().length < 1) {
            errors.push('title wajib');
        }
        if (year !== undefined && (!Number.isInteger(year) || year < 1800 ||  year > 2025 )) {
            errors.push('year harus integer valid (film dari tahun 1800 - 2025)');
        }
        if (errors.length) {
            return res.status(400).json({ errors });
        }
        next();
    },

    validateMovieUpdate : (req, res, next) => {
        const {title, year} = req.body; // yg wajib diisi dari body
        const errors = [];

        // title.trim().length : title dihapus dulu spasi baru dihitung jumlah karakter
        if (title !== undefined && (typeof title !== 'string' || title.trim().length < 1)) {
            errors.push('Jika disertakan, title tidak boleh kosong');
        }
        if (year !== undefined && (!Number.isInteger(year) || year < 1800 ||  year > 2025 )) {
            errors.push('year harus integer valid (film dari tahun 1800 - 2025)');
        }
        if (errors.length) {
            return res.status(400).json({ errors });
        }
        next();
    }
}