const mongoose=require("mongoose");
const Review = require("./review.js");
const { string } = require("joi");
const Schema=mongoose.Schema;


//These are the details for places in the website
const listingSchema=new Schema
({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,  
    },
    // image:{
    //   url: {
    //     type: String,
    //     default:
    //       "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    //     set: (v) =>
    //       v === ""
    //         ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //         : v,
      
    //   },
    // },
   
    image:{
     url:String,
     filename:String
    },
    price:Number,
    location:String,
    country:String,
    geometry: {
      type: {
        type: String,
        enum: ['Point'], // Must always be 'Point'
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      }
    },
   category: {
  type: String,
  enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Beach', 'Farms', 'Camping', 'Creative Spaces', 'Tiny Homes'],
},
    
    reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review",
    }],
    owner:
    {
      type:Schema.Types.ObjectId,
      ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing)
  {
  await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;