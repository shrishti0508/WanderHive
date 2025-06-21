const Listing=require("../models/listing");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.index=async (req, res) => {
    const allistings = await Listing.find({});
    res.render("listings/index.ejs", { allistings });
};


module.exports.renderNewForm=async (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate(
      {path:"reviews",
      populate:{
        path:"author",
       strictPopulate:false
      },
      }).populate("owner");
    if(!listing)
    {
      req.flash("error","Listing you have requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing=async (req, res,next) =>{
     let url=req.file.path;
     let filename=req.file.filename;

      const newListing = new Listing(req.body.listing);
      newListing.owner=req.user._id;
//       newListing.image = {
//   url: req.body.listing.image || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
// };
newListing.image={url,filename};
      // now Geocoding step here
  try {
    const locationQuery = req.body.listing.location;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    } else {
      console.log('No geocoding result found.');
    }
  } catch (err) {
    console.error('Error fetching geocoding:', err);
  }
      newListing.owner=req.user._id;
      await newListing.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
 let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", {
    listing,
    originalImageUrl 
  });
};

module.exports.updateListing=async (req, res) => {
      const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

  if (req.file) {
    const { path, filename } = req.file;
    listing.image = { url: path, filename };
    await listing.save(); // Save the updated image
  }
    
    let updatedImage = listing.image; // Keep the old image

    req.flash("success"," Listing Updated!");
    res.redirect(`/listings/${id}`);

};


module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted!");

    res.redirect("/listings");
  };