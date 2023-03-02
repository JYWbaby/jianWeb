const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router(); // get access to the params

// router.use(authController.protect);

// router.get('/checkout-session/:tourId', postController.getCheckoutSession);

// router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(postController.getAllPost)
  .post(postController.createPost);

router.route('/:id').get(postController.getPost);

// router
//   .route('/:id')
//   .get(bookingController.getBooking)
//   .patch(bookingController.updateBooking)
//   .delete(bookingController.deleteBooking);

module.exports = router;
