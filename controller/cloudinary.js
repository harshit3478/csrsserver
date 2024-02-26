const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})
uploadToCloudinary = async (path, folder) => {
    return await cloudinary.uploader.upload(path, {
        folder
    }).then((data) => {
        return { url: data.url, public_id: data.public_id };
    }).catch((error) => {
        console.log("error in uploading image to cloudinary is : ", error)
    })
}

removeFromCloudinary = async (public_id) => {

    console.log(result, error)
    await cloudinary.uploader.destroy(public_id, function (error, result) {

    })
}

module.exports = { uploadToCloudinary, removeFromCloudinary }