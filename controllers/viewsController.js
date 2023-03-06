const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Post = require('../models/postModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template
  // 3) Render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getUnderConstruction = catchAsync(async (req, res, next) => {
  res.status(200).render('underconstruction', {
    title: 'Site Under Construction!',
  });
});

exports.getHome = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).render('home', {
    title: 'Home',
    posts,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  res.status(200).render('editPost', {
    title: 'Edit Your Post!',
  });
});

exports.getViewPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });
  //console.log(post.title);
  res.status(200).render('viewPost', {
    title: 'View Post',
    post,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get the datwa, for the requrested tour(reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // 2) Build template

  // 3) Render template using the data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into you account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2_ Find tours with teh returened IDs
  const tourIDs = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    titile: 'My TOurs',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
