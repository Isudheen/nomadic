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
router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);
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

router.get(
  '/review-manage',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getReviewManage
);

router.get(
  '/review-manage/:id',
  authController.protect,
  viewsController.getReviewEdit
);

router.get(
  '/booking-manage',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getBookingManage
);

router.get('/my-reviews', authController.protect, viewsController.getMyReviews);

module.exports = router;
