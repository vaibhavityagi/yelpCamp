const mongoose = require('mongoose')
const Review = require('./review')
const { string, array } = require('joi')

const { Schema } = mongoose

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail')
    .get(function () {
        return this.url.replace('upload', 'upload/w_200')
    })

// to include virtuals when you JSON.stringify, by default they are not included 
const setOpts = { toJSON: { virtuals: true } }

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

    // virtual
    // properties: {
    //     popUpMarkup: {
    //         `<h1>${this.title}</h1>.....`
    //     }
    // }
}, setOpts)

// for cluster map
campgroundSchema.virtual('properties.popUpMarkup')
    .get(function () {
        // had to do it this way cz of JSON.parse()
        return {
            title: `<h6>${this.title}</h6>`,
            desp: `<p>${this.description.substring(0, 89)}</p>`,
            id: this._id
        }
    })


// after deletion of a campground, all the reviews associated w that particular campground will also get deleted
campgroundSchema.post('findOneAndDelete', async function (delCamp) {
    // console.log(delCamp)
    if (delCamp.reviews.length) {
        await Review.deleteMany({ _id: { $in: delCamp.reviews } })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema)

module.exports = Campground

// or
// module.exports = mongoose.model('Campground', campgroundSchema)



