const express = require('express');
const multer = require("multer");
const path = require("path");
const { uploadUserPic ,uploadPostPic} = require('../controllers/upload');

const router = express.Router();
const storage1 = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}.png`)
    }
})
const upload1 = multer({
    storage: storage1,
})

// router.put('/upload/profilepic', uploadUserPic);
router.post('/upload/profilepic',upload1.single('image'), uploadUserPic);
function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
const storage2 = multer.diskStorage({
    destination: './public/postimages',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}.png`)
    }
})
const upload2 = multer({
    storage: storage2,
})
router.post('/upload/postpic',upload2.single('image'), uploadPostPic);
function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
module.exports = router;