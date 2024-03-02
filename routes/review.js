const express= require ("express");
const router = express.Router({mergeParams: true}); 
const wrapAsync = require("../utils/wrapAsync.js"); // ..- parent directory

const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const listingController = require("../controllers/reviews.js");


//REVIEWS
// POST REVIEW route *** pass above func here and then wrapAsync for err handling ***
router.post("/",
isLoggedIn,  //user must be authenticated-logged in to add reviews
validateReview,  wrapAsync(listingController.createReview));

//DELETE REVIEW ROOUTTEE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(listingController.deleteReview));


module.exports = router;