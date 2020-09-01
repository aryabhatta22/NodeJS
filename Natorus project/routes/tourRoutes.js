const express = require('express')
const tourController = require('../controllers/tourController')

const router = express.Router();

// Param Middleware
router.param('id', tourController.checkID)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour)

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.UpdateTour)
  .delete(tourController.deleteTour)

module.exports = router;