const AppError = require('../utils/appError');
const Comment = require('./../models/commentModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createComment = factory.createOne(Comment);

exports.assignLayer = catchAsync(async (req, res, next) => {
  if (!req.body.parentComment) return next();
  const parent = await Comment.findById(req.body.parentComment);
  req.body.layer = parent.layer + 1;
  next();
});
exports.getComment = factory.getOne(Comment);
exports.getAllComment = factory.getAll(Comment);
// exports.updateBooking = factory.updateOne(Booking);
// exports.deleteBooking = factory.deleteOne(Booking);
