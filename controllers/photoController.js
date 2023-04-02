const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Photo = require('../models/photoModel');
const User = require('../models/userModel');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhoto = upload.array('photos');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  // if (!req.file) return next();
  console.log(req.files);

  //req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  //console.log(req.file.filename);
  // await sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.file.filename}`);
  try {
    const imagesPromises = req.files.map(async (file) => {
      const filename = file.originalname;

      const metadata = await sharp(file.buffer).metadata();
      const { width, height } = metadata;
      console.log(width, height);

      // Determine target dimensions based on aspect ratio
      const aspectRatio = width / height;
      let targetWidth = width / 2;
      let targetHeight = height / 2;
      while (targetHeight > 3200 || targetWidth > 3200) {
        targetWidth = targetWidth / 2;
        targetHeight = targetHeight / 2;
      }
      // if (aspectRatio >= 1) {
      //   // 3:2 aspect ratio or wider
      //   targetWidth = 3000;
      //   targetHeight = 2000;
      // } else {
      //   // 2:3 aspect ratio or taller
      //   targetWidth = 2000;
      //   targetHeight = 3000;
      // }
      // resize image
      const buffer = await sharp(file.buffer)
        .resize(targetWidth, targetHeight)
        .withMetadata()  // need this to keep rotate
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer();

      const params = {
        Bucket: 'yjphotos',
        Key: filename,
        Body: buffer, // replace `buffer` with your image buffer
      };

      // Upload the image to S3
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
        }
      });

      console.log(req.body.type);

      await Photo.create({
        author: req.user.id,
        name: filename,
        type: req.body.type,
        createdAt: Date.now(),
      });
    });

    await Promise.all(imagesPromises);

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }

  //next();
});
