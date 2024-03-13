const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
    const allCgs = await Campground.find({})
    res.render('campgrounds/index', { allCgs })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {

    // we cant do this for each field hence use data validators like joi
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    if (geoData.body.features.length === 0) {
        req.flash('error', 'Not a valid location, Retry!')
        return res.redirect('/campgrounds/new')
    }

    const newCg = new Campground(req.body.campground)

    // adding geoJson data
    newCg.geometry = geoData.body.features[0].geometry

    // to associate this campground to the user who created it
    newCg.author = req.user._id

    // image uploading
    for (img of req.files) {
        newCg.images.push({ url: img.path, filename: img.filename })
    }
    // or
    // newCg.images = req.files.map(f => ({ url: f.path, filename: f.filename }))


    await newCg.save()
    req.flash('success', 'successfuly created a new campground')

    console.log(newCg)

    res.redirect(`/campgrounds/${newCg._id}`)
}

module.exports.showCampground = async (req, res) => {
    const found = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    if (!found) {
        req.flash('error', 'Couldnt find what you are looking for')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground: found })
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Couldnt find what you are looking for')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampround = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true })
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Deleted the campground')
    res.redirect('/campgrounds')
}






module.exports.renderImageUpload = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/images/imagesUpload', { campground })

}

module.exports.renderImageDelete = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/images/imagesDelete', { campground })
}

module.exports.uploadImage = async (req, res) => {
    const { id } = req.params
    const foundCamp = await Campground.findById(id)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    foundCamp.images.push(...imgs)
    await foundCamp.save()
    req.flash('success', 'successfully uploaded all the images')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteImage = async (req, res) => {
    const { id } = req.params
    if (!req.body.deleteImages) {
        req.flash('error', 'No image selected to be deleted')
        return res.redirect(`/campgrounds/${id}/images/deleteForm`)
    }
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
    }
    await Campground.findByIdAndUpdate(id, { $pull: { images: { filename: { $in: req.body.deleteImages } } } }, { new: true })
    req.flash('success', 'successfully deleted the photo(s)')
    res.redirect(`/campgrounds/${id}`)
}