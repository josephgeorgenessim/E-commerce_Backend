const mongoose = require('mongoose')

// create schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand required'],
        trim: true,
        unique: [true, 'Brand must be unique'],
        minlength: [2, 'Too Short Brand Name'],
        maxlength: [32, 'Too Long Brand Name'],
    },
    // "A and B" ==> in URl "shoping.com/a-and-b"   this mean slug.
    slug: {
        type: String,
        lowercase: true
    },
    image: String,

}, { timestamps: true })

brandSchema.post('init', (doc) => {
    if (doc.image) {
        doc.image = `${process.env.BASE_URL}/brands/${doc.image}`
    }
})


// create model
const BrandModel = mongoose.model('Brand', brandSchema)


module.exports = BrandModel;