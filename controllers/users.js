const User= require("../models/user.js");

module.exports.rendersignupForm = (req, res)=>{
   
    res.render("users/form.ejs");
};

module.exports.signupUser = async(req, res)=>{ 
    try{ //if username is identical/repeated, then refresh the form page, after flashing the error
        let {username, email, password}= req.body;
        let newUser = new User ({ username, email });
     
        const registereduser= await User.register(newUser, password);
        console.log(registereduser);
        //jaise hi register/signup krle-user loggedIn bhi ho jaaye
        req.login(registereduser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
        })
        
    } catch(e){
        req.flash("error", e.message); //if repeated usename then refresh the form page after flashing error
        res.redirect("/signup");
    }
   
};


module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};


module.exports.authenticateLogin = async(req, res)=>{ //authentication via passport hence including that mw

    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";//if manual login-undefined path-cuz loggedIn is not called-hence, redirect to '/listings' if empty path comes in res.locals.redirectUrl
    res.redirect(redirectUrl);
  //res.redirect(req.session.redirectUrl); //post-login- user be able to access the same page they were interrupted from; since req.session can be accessed by all mw, methods and manipulated by passport
  
  };


  module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "logged out successfully!");
        res.redirect("/listings");
    })
};