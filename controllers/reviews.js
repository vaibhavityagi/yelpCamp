const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.index = (req, res) => {
    const { id } = req.params
    res.redirect(`/campgrounds/${id}`)
}

module.exports.newReview = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review = new Review(req.body.review)
    camp.reviews.push(review)
    review.author = req.user._id
    await review.save()
    await camp.save()
    req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id: campId, reviewId } = req.params
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted your review')
    res.redirect(`/campgrounds/${campId}`)
}