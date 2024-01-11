var express = require('express');
var router = express.Router();
const resturantController = require('../controllers/returantController');

/* CREATE RESTURANT */
router.post('/create', resturantController.createResturant);

/* GET RESTURANT */
router.get('/get', resturantController.getAllResturants);

/* GET RESTURANT */
router.get('/count', resturantController.totalResturants);

/* delete RESTURANT */
router.delete('/delete/:id', resturantController.deleteResturant);

/* update RESTURANT */
router.put('/update', resturantController.updateResturant);

/* update RESTURANT */
router.post('/send-email', resturantController.sendOrder);

module.exports = router;