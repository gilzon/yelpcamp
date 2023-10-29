
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
 const { campgroundSchema, reviewSchema } = require("./schemas");  
const Review = require('./models/review');

const validateCampground =(req,res,next) =>{
   
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg ,400)
    }else{
    next();
}
}
const validateReview = (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg ,400)
    }else{
    next();
}
}

const isLoggedIn= (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','you must be logged in first');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req,res, next)=>{
    if (req.session.returnTo ){
        res.locals.returnTo= req.session.returnTo;
    }
    next()
}
const isAuthor = async(req,res,next)=>{
    const { id , reviewId } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals (req.user._id)){
        req.flash('error','you do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
next();
}
const reviewAuthor = async(req,res,next)=>{
    const { id } = req.params;
    const review = await Review.findById(id);
    if(!review.author.equals (req.user._id)){
        req.flash('error','you do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
next();
}

module.exports = {
    validateCampground,
    validateReview,
    isLoggedIn,
    storeReturnTo,
    isAuthor,
    reviewAuthor
};