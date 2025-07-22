const multer = require("multer")
const ApiError = require("../utils/apiError")


exports.uploadSingleImage = (fieldName) => {
    // Upload images  "Disk Storage"

    // const storageCategoryImage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/categories')
    //     },
    //     filename: function (req, file, cb) {
    //         const extension = file.mimetype.split('/')[1]
    //         cb(null, `category-${Math.random()}-${Date.now()}.${extension}`)
    //     }
    // })


    // Upload images  "MemoryStorage Buffer"
    const storageCategoryImage = multer.memoryStorage()


    const multerFilter = function (req, file, cd) {
        if (file.mimetype.startsWith('image')) {
            cd(null, true)
        } else {
            cd(new ApiError('Only images allowed', 400), false)
        }
    }

    const upload = multer({ storage: storageCategoryImage, fileFilter: multerFilter })

    return upload.single(fieldName)
}