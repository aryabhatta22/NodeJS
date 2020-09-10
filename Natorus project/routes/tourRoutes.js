const express = require('express')
const tourController = require('../controllers/tourController')

const router = express.Router();

// Param Middleware
//router.param('id', tourController.checkID)

router
  .route('/top-5-tour')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.UpdateTour)
  .delete(tourController.deleteTour)

module.exports = router;