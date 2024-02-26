const multer = require("multer");

var storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, 'uploads/')
    // },
    // filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now()
    //   cb(null, uniqueSuffix + file.fieldname)
    // }
  })
  
const uploadFile = multer({ storage: storage })
module.exports = uploadFile;