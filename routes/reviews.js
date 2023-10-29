const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review')

const catchAsync = require('../utils/catchAsync');

const { validateReview, isLoggedIn, reviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, reviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;