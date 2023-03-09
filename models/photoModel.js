const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const photoSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
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


// nested virtual populate
// commentSchema.virtual('nestedChildren', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'parentComment',
//   justOne: false,
//   options: { sort: { createdAt: -1 } },
//   populate: { path: 'children' },
// });

photoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: '-__v -passwordChangedAt -photo',
  });
  next();
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
