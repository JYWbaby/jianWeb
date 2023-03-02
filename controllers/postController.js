/* eslint-disable no-restricted-syntax */
const AppError = require('../utils/appError');
const Post = require('./../models/postModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

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

exports.createPost = factory.createOne(Post);
// exports.getPost = factory.getOne(Post, {
//   path: 'comments',
//   populate: {
//     path: 'nestedChildren',
//   },
// });
exports.getAllPost = factory.getAll(Post);
// exports.updateBooking = factory.updateOne(Booking);
// exports.deleteBooking = factory.deleteOne(Booking);
