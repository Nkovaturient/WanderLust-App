const Listing= require("./models/listing.js");
const Review= require("./models/reviews.js");
const ExpressError = require( "./utils/ExpressError.js");
const { listingSchema, reviewSchema }= require("./schema.js"); //serverSide validation

module.exports.isLoggedIn = (req, res, next)=> {//saving from anonymous api req from postman/hoppscotch
    // console.log(req.user);
    // console.log(req.path, "..", req.originalUrl); //'/new .. /listings/new'
    if( !req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must Login to add or edit a listing!");
       return res.redirect("/login");
    }
    next();
};

//passport cannot amend locals which otherwise req.session.redirectUrl is prone to  reset by passport--hence
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl) {//if redirecturl is saved
        res.locals.redirectUrl= req.session.redirectUrl; //redirecturl session se locals mei store kra lenge
    }
    next();
};

//authorised user to only edit delete or update the listings
module.exports.isOwner= async(req, res, next)=>{
    let { id } = req.params;
    let listing=  await Listing.findById(id);
    // console.log(res.locals.currUser);
    // console.log(listing);
    if(!listing.owner._id.equals(res.locals.currUser._id)){ //before updating check for the authorised user
        req.flash("error", "You are not authorised to amend this listing!");
      return  res.redirect(`/listings/${id}`);
    }
    next();
}

//authorised user to only edit delete or update the listings
module.exports.isReviewAuthor= async(req, res, next)=>{
    let { id, reviewId } = req.params;
    let review=  await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){ //before updating check for the authorised user
        req.flash("error", "Unauthorised: You cannot amend this reviews!");
      return  res.redirect(`/listings/${id}`); //show page
    }
    next();
}

//server-side-validation -- validating joi schema
 module.exports.validateListing= (req, res, next)=>{ 
    let {error} = listingSchema.validate(req.body);
    //  console.log(result);
     if(error){
        let errMsg= error.details.map( (el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
     } else {
        next();
     }
};

 //server-side-validation -- validating joi reviewschema
module.exports.validateReview= (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    //  console.log(result);
     if(error){
        let errMsg= error.details.map( (el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
     } else {
        next();
     }
};