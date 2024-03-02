const express= require("express");
const app= express();
const path= require("path");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require("../utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: 'keyboardCat', 
    resave: false,
    saveUninitialized: true
   };

app.use(session(sessionOptions)); //sessiion mw
app.use(flash); //setup session- cookieParser- session mw before enabling flash mw

app.get("/register", (req, res)=>{ //storing info 
    let {name= "alien"}= req.query;
    // console.log(req.session);
     
    req.session.name = name;
    console.log(req.session.name);
    // req.flash('success', 'user was registered successfully');
    res.redirect("/hello");

});

app.get("/hello", (req, res)=>{ //accessing and using info
    // res.render("page.ejs", { name: req.session.name});
    res.send(`Bonjour, ${req.session.name} !`);
});


//counting user sessions
app.get("/reqCount", (req, res)=>{
    if(req.session.count) {
        req.session.count ++;
    } else {
        req.session.count = 1;
    }
    
    res.send(`You sent a request ${req.session.count} times` );
});






const cookieParser = require("cookie-parser");

// //signed cookies
app.use(cookieParser("secretcode"));
// app.get("/getsignedcookies", (req, res)=>{
//     res.cookie("sending", "secretsignedCode", {signed: true});
//     res.send("done!");
// });

// app.get("/verify", (req, res)=>{
//     res.send(req.cookies);
//     // res.send(req.signedCookies);
//     console.log(req.signedCookies);
// })
// //cookies
// app.get("/setcookies", (req, res, cookies)=>{
//     res.cookie("greet", "namaste");
//     res.cookie("origin", "India");
//     res.send(`WE SENT YOU ${cookies}`);
// });

// app.get("/check", (req, res)=>{
//     let {name = "default anonymous"} = req.cookies;
//     res.send(`Hi ! ${name}`);
// })


// app.get("/", (req, res)=>{ //--install cookie parser to access it
//    console.dir( req.cookies); //cookies access through req--above res cookies sent are always  part of request
//     res.send(`hola buddy! how was XENIUM 6.0`);
// });


// app.use("/users", users); //ensure routes match to fetch corresponding GET,POST,DEL req
// app.use("/posts", posts); //writing down common path





app.listen(3000, ()=>{
    console.log(`Port : 3000 activated!`);
});