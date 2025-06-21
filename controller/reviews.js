const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
   //  if (!listing) {
   //     return next(new ExpressError(404, "Listing not found!"));
   // }
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
   console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    req.flash("success","New Review Created!");

    await listing.save();

    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
        // Remove the reference to the review from the listing
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        // Delete the actual review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");

    res.redirect(`/listings/${id}`);

};