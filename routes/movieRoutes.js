const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
// const auth = require('../middlewares/auth');
const {validateMovieCreate, validateMovieUpdate} = require('../middlewares/validation'); // lebih dari satu pakai {} 

router.get('/', movieController.getAll); //public
router.get('/:id', movieController.getById); //public
// middleware bisa lebih dari satu
router.post('/', validateMovieCreate, movieController.create); //ntar protected, tambahin middleware
router.put('/:id', validateMovieUpdate, movieController.update); //ntar protected
router.delete('/:id', movieController.remove); //ntar protected


module.exports = router;