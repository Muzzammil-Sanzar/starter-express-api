var express = require('express');
var router = express.Router();
const NewsLatterController = require('../controllers/newsLatterController');

/* CREATE RESTURANT */
router.post('/create', NewsLatterController.createNewsLatter);

/* GET RESTURANT */
router.get('/get', NewsLatterController.getNewsLatter);

/* Delete newsletter */
router.delete('/delete/:id', NewsLatterController.deleteNewsLetter);

module.exports = router;