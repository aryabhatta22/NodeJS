const express = require('express')
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authentication')

const router = express.Router();

// Param Middleware
//router.param('id', tourController.checkID)

router
  .route('/top-5-tour')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/tour-stats')
  .get(tourController.getTourStats)

  router
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan)

router
  .route('/')
  .get(authController.protect ,tourController.getAllTours)
  .post(tourController.createTour)

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.UpdateTour)
  .delete(authController.protect, 
    authController.restrictTo('admin', 'lead-guide'),
     tourController.deleteTour)

module.exports = router;