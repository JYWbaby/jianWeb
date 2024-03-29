/* eslint-disable no-restricted-syntax */
const AWS = require('aws-sdk');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-id-timestamp.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

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

exports.uploadPostCover = upload.single('imageCover');

exports.resizePostCover = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  console.log(req.file.filename);

  const metadata = await sharp(req.file.buffer).metadata();
  const { width, height } = metadata;

  let targetWidth = 1800;
  let targetHeight = 1200;

  // await sharp(req.file.buffer)
  //   .resize(3000, 2000)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/posts/${req.file.filename}`);

  const buffer = await sharp(req.file.buffer)
    .resize(targetWidth, targetHeight)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  const params = {
    Bucket: 'yjcovers',
    Key: req.file.filename,
    Body: buffer, // replace `buffer` with your image buffer
  };

  // Upload the image to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
    }
  });

  next();
});

async function populateNestedComments(comments, depth = 1) {
  if (depth > 5) {
    return;
  }
  for (const comment of comments) {
    // eslint-disable-next-line no-await-in-loop
    await comment.populate('children').execPopulate();
    // eslint-disable-next-line no-await-in-loop
    await populateNestedComments(comment.children, depth + 1);
  }
}

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('comments');
  await populateNestedComments(post.comments);

  if (!post) {
    return next(new AppError('No doc found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;
  //console.log(req.file.filename);
  if (req.file)
    req.body.imageCover = req.file.filename;
  const doc = await Post.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.editPost = catchAsync(async (req, res, next) => {
  if (!req.body.author) req.body.author = req.user.id;
  //console.log(req.file.filename);
  if (req.file)
    req.body.imageCover = req.file.filename;
  const doc = await Post.findOneAndUpdate({ slug: req.body.slug }, req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

// exports.getPost = factory.getOne(Post, {
//   path: 'comments',
//   populate: {
//     path: 'nestedChildren',
//   },
// });
exports.getAllPost = factory.getAll(Post);
// exports.updateBooking = factory.updateOne(Booking);
// exports.deleteBooking = factory.deleteOne(Booking);
