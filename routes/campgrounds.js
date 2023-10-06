const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateCampground, isUploadable, canUploadMore } = require('../middlewares')
const campgrounds = require('../controllers/camprounds')



router.route('/')
    .get(catchAsync(campgrounds.index))
    // update logic so that validation takes place before uploading of images
    .post(isLoggedIn, upload.array('campground[image]'), isUploadable, validateCampground, catchAsync(campgrounds.createCampground))



router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampround))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.route('/:id/images')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderImageUpload))
    .post(isLoggedIn, isAuthor, upload.array('image'), canUploadMore, catchAsync(campgrounds.uploadImage))
    .delete(isLoggedIn, isAuthor, catchAsync((campgrounds.deleteImage)))


router.get('/:id/images/deleteForm', isLoggedIn, isAuthor, catchAsync(campgrounds.renderImageDelete))


module.exports = router