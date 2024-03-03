if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET); // remove this after you've confirmed it is working


const mongoose= require("mongoose");
const express= require ("express");
const app= express();
const path= require("path");
const methodOverride= require("method-override");
const ExpressError = require( "./utils/ExpressError.js");
const flash= require("connect-flash");
const passport = require("passport");
const  LocalStrategy = require("passport-local");
const User = require('./models/user.js');

const session  = require("express-session"); //require session
const MongoStore = require('connect-mongo');

const ejsMate= require("ejs-mate");
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl= process.env.ATLASDB_URL; //start from cprompt as well

//creating our database
main().then(()=>{
    console.log("connected to DB!");
})
.catch( (err)=>{
    console.log(err);
});



async function main() { 
    await mongoose.connect(MONGO_URL);
  }


  //define mongoStore
const store= MongoStore.create({
    mongoUrl: MONGO_URL, //or 'mongoUrl/dbUrl, if local/cloudAtlas
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, 
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE!", err);
});

//define sessionoptions
const sessionOptions= {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const demouserRouter = require("./routes/user.js");


app.use(session(sessionOptions)); //use mw session
app.use(flash()); // flash mw

//after session mw implement passport 
app.use(passport.initialize());
app.use(passport.session()); //webrowser needs to identify users as they browse from page to page
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{ 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    res.locals.currUser= req.user; //show sign/login/logout accordingly if user registered or not
    next();
});

//demo user
// app.get("/registeruser", async(req, res)=>{
//     let fakeUser = new User ({
//         email: "david@gmail.com",
//         username: "David Cameroon",
//     });

//     let newUser = await User.register(fakeUser, "helloWorld");
//     res.send(newUser);

// });

//signupdemouser

//router object mw--
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", demouserRouter);



//ROOT Route
// app.get("/", (req, res)=>{
//     res.send("activated!");
// });


//PAGE NOT FOUND
app.all( "*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});


//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next)=>{
    let { status= 500, message= "Internal Server Error"} = err;
    
    res.status(status).render("./listings/error.ejs", { err });
    // res.status(status).send(message);
});

let port= 3000;
app.listen(port, ()=>{
    console.log(`Port : ${port} activated!`);
})




//INSERTING DATA AND TESTING
// app.get("/testListing", async(req, res)=>{
//   let sampleList=  new Listing( {
//     title: " My new Villa",
//     description: " amidst the snowflakes ",
//     price: 2456,
//     location: "Venezuela ",
//     country: " Italy ",

//   })
//   await sampleList.save();
//   console.log("sample was saved");
//   res.send("successful testing!");

// });

//CREATE ROUTE
// app.post("/listings", (req, res)=>{
//     let {title, description, image, price, location, country}= req.body;
//     let newList= new Listing ( {
//        title: title,
//        description: description,
//        image: image,
//        price: price,
//        location: location,
//        country: country,
//     });
// if(!req.body.Listing){ // empty form
//     throw new ExpressError(400, "send valid data for listing");
//    }

//    if(! newListing.title) { //either field is empty
//     throw new ExpressError(400, "Title is missing!");
//    }
//    if(! newListing.description) {
//     throw new ExpressError(400, "Description is missing!");
//    }
//    if(! newListing.price) {
//     throw new ExpressError(400, "Price not mentioned!");
//    }
//    if(! newListing.location) {
//     throw new ExpressError(400, "Location is missing");
//    }

//     newList.save()
//     .then(()=>{
//         console.log(`list was added and saved`);
//       })
//       .catch((err)=>{
//         console.log(err);
//       });
//       res.redirect("/listings");
// });

