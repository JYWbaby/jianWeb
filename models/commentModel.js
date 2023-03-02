const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    layer: {
      type: Number,
      default: 1,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    // childComments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment',
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
commentSchema.virtual('children', {
  ref: 'Comment',
  foreignField: 'parentComment',
  localField: '_id',
});

// you should update layer info
commentSchema.pre('save', function (next) {
  if (this.layer >= 5)
    return next(new AppError('nested comment cannot exceed 5 layers', 404));
  next();
});

// nested virtual populate
// commentSchema.virtual('nestedChildren', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'parentComment',
//   justOne: false,
//   options: { sort: { createdAt: -1 } },
//   populate: { path: 'children' },
// });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: '-__v -passwordChangedAt -photo',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
