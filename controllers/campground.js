const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken : mapBoxToken });
const cloudinary = require('cloudinary');


const index = async (req,res)=>{
    const campgrounds = await Campground.find({});
   
        res.render('campgrounds/index',{campgrounds})
    }
    
     const createNewForm = (req,res)=>{ res.render('campgrounds/new')}

    const createNewCamp =  async (req,res)=>{
   const geoData =  await geocoder.forwardGeocode({
            query:req.body.campground.location,
            limit:1
        }).send()
       
         const campground =  new Campground(req.body.campground);
          campground.geometry =  (geoData.body.features[0].geometry);
        campground.images = req.files.map(f=>({url:f.path , filename : f.filename}));
        campground.author = req.user._id;
        await campground.save();
        req.flash('success','Successfully made a new campground!')  
        res.redirect(`/campgrounds/${campground._id}`)
     }
 const showCampground = async (req,res)=>{ 
    const campground  = await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    console.log(campground);
    
     res.render('campgrounds/show',{ campground })
}

const editCampForm = async (req,res)=>{ 
    const campground  = await Campground.findById(req.params.id)
    
     res.render('campgrounds/edit',{ campground })
}

const updateCampground =  async (req,res)=>{
    const {id}= req.params;
    console.log(req.body)
    req.flash('success',' succesfully updated campground')
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
     
    const imgs = req.files.map(f=>({url:f.path , filename : f.filename}))
   
    campground.images.push (...imgs);
    await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({$pull :{images:{filename:{$in:req.body.deleteImages}}}});
    console.log(campground)
  }
    res.redirect(`/campgrounds/${campground._id}`)
}
const deleteCamp =  async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('error','campground deleted ')
    res.redirect('/campgrounds');
}

    module.exports = {
        index , 
        createNewForm,
        createNewCamp,
        showCampground,
        editCampForm,
        updateCampground,
        deleteCamp,

    }