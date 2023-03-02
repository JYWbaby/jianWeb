const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A post name must have less or equal then 40 characters'],
      minlength: [10, 'A post name must have more or equal then 10 characters'],
      //validate: [validator.isAlpha, 'post name must only contain characters'],
    },
    slug: String,
    imageCover: {
      type: String,
      required: [true, 'A post must have a cover image'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      //select: false, // hide from output
    },
    content: {
      type: String,
    },
    // locations: [
    //   {
    //     type: {
    //       type: String,
    //       default: 'Point',
    //       enum: ['Point'],
    //     },
    //     coordinates: [Number],
    //     address: String,
    //     description: String,
    //     day: Number,
    //   },
    // ],
    author: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
  match: { parentComment: null },
});

// document middleware : runs before .save() and .create() (not work with insertMany())
postSchema.pre('save', function (next) {
  this.slug = slugify(`${this.author} ${this.title}`, { lower: true });
  next();
});

// // handle guide embedding
// postSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

// postSchema.pre('save', (next) => {
//   console.log('Will save document...');
//   next();
// });

// postSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// postSchema.pre(/^find/, function (next) {
//   // reg exp
//   this.find({ secretpost: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: '-__v -passwordChangedAt -photo',
  });
  next();
});

// postSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} ms`);
//   //console.log(docs);
//   //console.log(this);
//   next();
// });

// AGGREGATION MIDDLEWARE
// postSchema.pre('aggregate', function (next) {
//   // this --> aggr obj
//   this.pipeline().unshift({ $match: { secretpost: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
