const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// router.get(
//   '/',
//   bookingController.createBookingCheckout,
//   authController.isLoggedIn,
//   viewsController.getOverview
// );

router.get('/', authController.isLoggedIn, viewsController.getHome);

router.get('/gallery', authController.isLoggedIn, viewsController.getGallery);

router.get(
  '/underConstruction',
  authController.isLoggedIn,
  viewsController.getUnderConstruction
);
router.get(
  '/create-post',
  authController.isLoggedIn,
  viewsController.createPost
);

router.get(
  '/edit-post/:slug',
  authController.isLoggedIn,
  viewsController.editPost
);

router.get(
  '/view-post/:slug',
  authController.isLoggedIn,
  viewsController.getViewPost
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
