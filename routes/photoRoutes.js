const express = require('express');
const authController = require('../controllers/authController');
const photoController = require('../controllers/photoController');

const router = express.Router(); // get access to the params

router
  .route('/')
  .post(
    authController.protect,
    photoController.uploadPhoto,
    photoController.resizePhoto
  );

module.exports = router;
