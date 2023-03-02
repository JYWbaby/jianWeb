const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router(); // get access to the params

// router.use(authController.protect);

// router.get('/checkout-session/:tourId', postController.getCheckoutSession);

// router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(commentController.getAllComment)
  .post(commentController.assignLayer, commentController.createComment);

router.route('/:id').get(commentController.getComment);
//   .patch(bookingController.updateBooking)
//   .delete(bookingController.deleteBooking);

module.exports = router;
