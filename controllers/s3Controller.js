// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');
// Import AppError class
const AppError = require('../utility/appError');
// Import s3 bucket class
const S3Bucket = require('../utility/s3');


// Handle generation of s3 signed urls
exports.gets3Url = catchAsync(async (req, res, next) => {
    const s3 = new S3Bucket();
    const url = await s3.generateUploadURL();
    res.status(200).json({
        status: 'success',
        data: url
    });
});