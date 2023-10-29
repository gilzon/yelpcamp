
const mongoose = require('mongoose');

const cities = require('./cities');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');




mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
   
    useUnifiedTopology: true

});

const db= mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once("open", ()=>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async  ()=>{
await   Campground.deleteMany({});
for(let  i = 0; i<200; i++){
const random1000 = Math.floor(Math.random()*1000);
const camp =new Campground({
    author :"652cec91c9551fd1571c2b29",
    location:`${cities[random1000].city},${cities[random1000].state}`,
    title :`${sample(descriptors)} ${sample(places)}`,
    geometry: {
      type: "Point",
      coordinates: [
        cities[random1000].longitude ,
        cities[random1000].latitude
      ]
      //why am i not getting these locations in my map cluster but a single location different from all this ?
  },
    images:  [
        {
          url: 'https://res.cloudinary.com/dnxdktspd/image/upload/v1697570428/yelpcamp/ajylgqqieb55kkbxb2kl.jpg',
          filename: 'yelpcamp/ajylgqqieb55kkbxb2kl',
          
        },
        {
          url: 'https://res.cloudinary.com/dnxdktspd/image/upload/v1697570441/yelpcamp/quntfc8i7rlt9zydnamz.jpg',
          filename: 'yelpcamp/quntfc8i7rlt9zydnamz',
         
        }

      ],
    
    description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet sit suscipit necessitatibus dolorum nisi vel illum maxime delectus voluptatem quis. Ipsa porro laboriosam nisi, minus asperiores ratione modi unde omnis!',
});
try {
    await camp.save();
} catch (err) {
    console.error(err);
}
}
}

seedDB().then(() => {
mongoose.connection.close();
});


