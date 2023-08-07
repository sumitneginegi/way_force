const express = require('express')
const { createOffer,uploadImageOfOffer,getAllOffers,deleteOffer} = require('../controller/admin/coupencode')

const coupencodeRouter = express.Router()

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dbrvq9uxa", api_key: "567113285751718", api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4", });
const storage = new CloudinaryStorage({
        cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });

        


coupencodeRouter.post('/createOffer',createOffer)
coupencodeRouter.put('/uploadImageOfOffer/:id',upload.single('image'),uploadImageOfOffer)
coupencodeRouter.delete('/deleteOffer/:id',deleteOffer)
coupencodeRouter.get('/getAllOffers',getAllOffers)


  
module.exports =coupencodeRouter