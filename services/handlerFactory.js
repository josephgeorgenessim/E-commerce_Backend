const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params

        const document = await model.findByIdAndDelete(id)
        if (!document) {
            return next(new ApiError(`no document for this id ${id}`, 404))
        }
        res.status(200).json({
            msg: `Deleted `
        })
    })

exports.updateOne = (model, name) =>
    asyncHandler(async (req, res, next) => {
        const document = await model.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!document) {
            return next(new ApiError(`no ${name} document for this id ${req.params.id}`, 404))
        }
        res.status(200).json({
            [name]: document,
        })
    });

exports.create = (model, name) => asyncHandler(async (req, res, next) => {

    const document = await model.create(req.body);

    res.status(201).json({ [name]: document })

})


exports.getOne = (model, name) => asyncHandler(async (req, res, next) => {

    const document = await model.findById(req.params.id)
    if (!document) {
        return next(new ApiError(`no ${name} for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        [name]: document,
    })
})


exports.getAll = (model, name) => asyncHandler(async (req, res) => {
    let filter = {}

    if (req.filterObj) {
        filter = req.filterObj
    }
    //  Build Query 
    const apiFeatures = new ApiFeatures(model.find(filter), req.query).sort().search(name).limitFields().filter().pagination()
    const allCount = await model.countDocuments();

    const { mongooseQuery, paginationResult } = apiFeatures
    // Execute query
    const documents = await mongooseQuery

    res.status(200).json({
        [name]: documents,
        paginationResult,
        total: documents.length,
        [`totalAll${name.charAt(0).toUpperCase() + name.slice(1)}`]: allCount,
    })
})