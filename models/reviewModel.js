const mongoose = require('mongoose');
const ProductModel = require('./productModel');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required'],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product required'],
    },
    ratings: {
        type: Number,
        required: [true, 'Rating required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
    },
    comment: {
        type: String,
        required: [true, 'Comment required'],
    },
}, { timestamps: true })


reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    })
    next()
})


reviewSchema.statics.calcAverageRatingsAndQuantity = async function (product) {
    const stats = await this.aggregate([
        {
            $match: { product: product }
        },
        {
            $group: {
                _id: 'product',
                ratingQuantity: { $sum: 1 },
                avgRating: { $avg: '$ratings' }
            }
        }
    ])

    if (stats.length > 0) {
        await ProductModel.findByIdAndUpdate(product, {
            ratingsQuantity: stats[0].ratingQuantity,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await ProductModel.findByIdAndUpdate(product, {
            ratingsQuantity: 0,
            ratingsAverage: 0
        })
    }
}

// save review
reviewSchema.post('save', function (next) {
    this.constructor.calcAverageRatingsAndQuantity(this.product)
})

// delete review
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await this.model.calcAverageRatingsAndQuantity(doc.product);
    }
});


const ReviewModel = mongoose.model('Review', reviewSchema)

module.exports = ReviewModel
