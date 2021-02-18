const cloudinary = require('cloudinary').v2;
const multer = require('multer');
//connect multer with cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({ //comes from the cloudinary
    cloudinary,
    params: {
      folder: 'winekeeper', //will enventually create a folder
      allowed_formats: ['jpg', 'png'] 
    },
    filename: function(req, file, cb) { //cb callback function
      cb(null, file.originalname); 
    }
});

//pass storage to multer
const uploadCloud = multer({ storage });

module.exports = uploadCloud;