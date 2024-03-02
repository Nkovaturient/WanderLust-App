const express= require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const listingController = require("../controllers/users.js");

router.route("/signup")
.get( listingController.rendersignupForm) 
.post( wrapAsync(listingController.signupUser)); //signup USer


router.route("/login")
.get( listingController.renderLoginForm)  //login USER
.post(   //passport.autheticate("strategy", {option})
saveRedirectUrl,  //call this mw first before passport authenticates loggedin user
passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), //if authetication fails, no proceeding further & redirect else 
wrapAsync(listingController.authenticateLogin));


//logout user--uses serialize/deserialize passport
router.get("/logout", listingController.logout);


module.exports = router;