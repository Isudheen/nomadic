const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get(
  '/tour-manage',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getTourManage
);
router.get(
  '/tour-manage/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getTourEdit
);

router.get(
  '/user-manage',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getUserManage
);

router.get(
  '/user-manage/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getUserEdit
);

module.exports = router;
