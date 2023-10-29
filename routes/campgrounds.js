const  express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campground');
const multer = require ('multer');
const { storage } = require ('../cloudinary/index')
const upload = multer({ storage });





router.get('/',catchAsync(campgrounds.index))



router.get('/new',isLoggedIn, campgrounds.createNewForm)
 



router.post('/',isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createNewCamp))




router.get('/:id',catchAsync( campgrounds.showCampground))

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync( campgrounds.editCampForm))

router.put('/:id',upload.array('image'),isLoggedIn,isAuthor,validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCamp))



module.exports = router ;