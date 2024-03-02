const express= require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // ..- parent directory
const Listing= require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//requiring cloudinary info from cloudconfig
const { storage}= require("../cloudConfig.js");
//upload img pkg- multer require and initialize
const multer  = require('multer');
const upload = multer({storage });

const listingController = require("../controllers/listings.js");

router.route("/")
.get( wrapAsync(listingController.index)) //INDEX ROUTE
.post( isLoggedIn,
     
     upload.single('listing[image]'),
     validateListing,
      wrapAsync(listingController.createListing)); //CREATE new listing ROUTE *** EHM via wrapAsync *** connect-flash ***

// .post( upload.single('Listing[image]'), (req, res)=>{  //upload the single img received from listing[image]
//     res.send(req.file);
// });


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/:id")
.get(  wrapAsync(listingController.showListing)) //Show ROUTE
.put(  isLoggedIn, isOwner,    //UPDATE ROUTE
      upload.single('listing[image]'),
      validateListing,
       wrapAsync(listingController.updateListing))  
.delete(  isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));  //DESTROY ROUTE


//Edit ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;