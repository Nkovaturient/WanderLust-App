const Review= require("../models/reviews.js");
const Listing= require("../models/listing.js");

module.exports.createReview = async(req, res)=>{
    console.log(req.params.id);
    let listingId= await Listing.findById(req.params.id);
    
    let addReview = new Review(req.body.Review); 
    addReview.author= req.user._id; //to store the userinfo who added new reviews
    console.log(addReview);

    //pushing our child(reviews) into parent(listingschema[reviews])
    listingId.reviews.push(addReview);

    await addReview.save();
    await listingId.save();

    // console.log("added reviews");
    // res.send("new review saved");

    req.flash("success", "Review Added!"); 
    res.redirect(`/listings/${listingId._id}`);

};


module.exports.deleteReview = async(req, res)=>{
    let { id, reviewId } = req.params;
  
    //2nd pulling and updating from listing array
    await Listing.findByIdAndUpdate(id, {$pull: { reviews : reviewId}});
    //1st del from review collections
    await Review.findByIdAndDelete(reviewId);
  
    req.flash("success", "Review Deleted!"); 
    res.redirect(`/listings/${id}`);
  };