const Campground = require('./models/campground')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas')



module.exports.validateCampground = (req, res, next) => {

    // campgroundSchema.validate returns an object

    const { error } = campgroundSchema.validate(req.body)
    // console.log(error)
    if (error) {
        const mssg = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(mssg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const mssg = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(mssg, 400)
    } else {
        next()
    }
}

module.exports.isLoggedIn = (req, res, next) => {

    // storing the url that the user is trying to request
    req.session.returnTo = req.originalUrl

    // console.log(`req.user....${req.user}`)

    if (!req.isAuthenticated()) {
        req.flash('error', 'You are not logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {

    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isUploadable = async (req, res, next) => {
    if (req.files.length > 5) {
        req.flash('error', 'Cannot upload more than 5 files')
        return res.redirect('/campgrounds/new')
    }
    next()
}

module.exports.canUploadMore = async (req, res, next) => {
    const { id } = req.params
    const foundCamp = await Campground.findById(id)
    let filesCount = foundCamp.images.length + req.files.length
    if (filesCount > 5) {
        req.flash('error', 'Cannot upload more than 5 files')
        return res.redirect(`/campgrounds/${id}/images`)
    }
    next()
}



// passport adds certain functions on the req object
// req.isAuthenticated() tells if the user is logged in or not
// req.user gives the mongo document of the logged in user
// req.logout(callback), req.login(callback) to log in and log out the user