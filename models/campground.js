var mongoose = require('mongoose');
const Review = require('./review');
// const { campgroundSchema } = require('../schemas');
const Schema =mongoose.Schema;
let ImageSchema = new Schema(
  {
    url:String,
    filename:String
  });
  ImageSchema.virtual('thumbnail').get (function(){
    return this.url.replace('upload','upload/w_200');
  })
  const opts = { toJSON: { virtuals: true } };

let campgroundSchema = new Schema({
    title : String,
    images:[ ImageSchema],
    geometry: {
     type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
   description : String,
     price : Number ,
    location:String,
     author:{
      type:Schema.Types.ObjectId,
      ref:'User'
     },
    reviews:[
     { type:Schema.Types.ObjectId,
      ref:'Review'
    }]
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});


campgroundSchema.post('findOneAndDelete',async function(doc){
  if(doc){
    await Review.deleteMany({
      _id: {
        $in:doc.reviews
      }
    })
  }
})

module.exports=mongoose.model('campground',campgroundSchema);

