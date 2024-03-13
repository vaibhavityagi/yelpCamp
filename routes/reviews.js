const express = require('express')
const router = express.Router({ mergeParams: true }) //so that we can access campgroundId defined in the app.js file, by default we dont have access to those parameters

const catchAsync = require('../utils/catchAsync')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares')
const reviews = require('../controllers/reviews')

router.route('/')
    .get(reviews.index)
    .post(isLoggedIn, validateReview, catchAsync(reviews.newReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))



module.exports = router