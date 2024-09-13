const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require('path');

// create s3 instance using S3Client 
// (this is how we create s3 instance in v3)
const access_key = process.env.AWS_ACCESS_KEY;
const secret_key = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET_NAME;

console.log()
const s3 = new S3Client({
    credentials: {
        accessKeyId:access_key, 
        secretAccessKey: secret_key
    },
    region: "ap-south-1" 
})

const s3Storage = multerS3({
    s3: s3, 
    bucket: bucket, 
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});


function sanitizeFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg", ".gif" ,".heic"];
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        cb("Error: File type not allowed!");
    }
}

// our middleware
const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 10
    }
})

module.exports = uploadImage;