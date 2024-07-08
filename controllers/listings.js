const Listing= require("../models/listing.js");


module.exports.index= async(req, res)=>{

    let allList= await Listing.find( { });
    res.render("./listings/index.ejs", {allList});

};

module.exports.searchLoc= async(req, res)=>{

    const { venue } = req.query; //CASE-SENSITIVE

    const place= venue.charAt(0).toUpperCase();
    console.log(place);

    if(venue == ""){
      res.send("nothing searched!");
    } else{ 
        // res.send(`searched for ${venue}`);
      

        let list= await Listing.find( {location : venue });
        if(list && list.length) {
        res.render("./listings/search.ejs", {venue, list});
        } else {
            req.flash("error", "either the listing does not exist or try searching the location with the first letter capitalized!");
         res.redirect("/listings");
        }
        
     }


    // // Construct MongoDB query
    //     const query = {
    //         $or: [
    //             { country: { $regex: country, $options: 'i' } }, // Case-insensitive regex matching
    //             { location: { $regex: location, $options: 'i' } }
    //         ]
    //     };

    //     // Execute query
    //     const result = await Listing.find(query);
    //     console.log(result);
};


//categorical listing
module.exports.categoryList = (req, res) =>{
    res.send(req.body);
}

module.exports.renderNewForm= (req, res)=>{ //before show route cuz js mistakes "new" for "id" route 
    // console.log(req.user);
    //user must be authenticated-logged in to add/create listings
    // const categories=["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping","farms", "arctic", "domes", "boats"];
    res.render("./listings/new.ejs" );
};


module.exports.showListing = async(req, res)=>{
    let {id}= req.params;
    let showList= await Listing.findById(id).populate({  //nested populate
        path: "reviews",
        populate: {
        path: "author"
    }
}).populate("owner"); //to extract detaileddata from ids of reviews, owner, and review author

    // console.log(showList); //** express.urlencoded **
    if(!showList){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    
    res.render("./listings/show.ejs", {showList});
};


module.exports.createListing = async(req, res)=>{

    let url= req.file.path;
    let filename= req.file.filename;
    // console.log(url, "...", filename);
   
    let newListing= new Listing(req.body.listing);
    newListing.owner= req.user._id; //to store the userinfo who added new listing **same for reviews**
    newListing.image= {url, filename}; //sending url and filename to our listing[image]
    let{category}=req.body.listing;
    newListing.category=category; 
     console.log(newListing);
    //  console.log(req.user);
 
     await newListing.save();

     req.flash("success", "New Listing Created!");
     res.redirect("/listings"); //ye display hoga index page hence= index.ejs
    
 };


 module.exports.renderEditForm = async(req, res)=>{
    let {id}= req.params;
    let findList=await Listing.findById(id);
    if(!findList){
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    // console.log(findList); //valid only for those imgs stored in cloudinary-ok
    let originalImageUrl= findList.image.url; 
   originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_300,w_250/e_blur:150");
//    console.log(originalImageUrl);
    res.render("./listings/edit.ejs", {findList, originalImageUrl});
};


module.exports.updateListing = async(req, res)=>{

    let{id}= req.params; //deconstructing our js object into individual parameters
    //before updating check for the authorised user

    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename= req.file.filename;
        let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});

        listing.image= {url, filename}; /**note the obj name */

        if(!listing.category) /*adding category field*/ 
        listing.category= "trending";

        await listing.save();
        // console.log(listing);
        // console.log(listing.image.url);
        
        req.flash("success", "Listing Updated!"); 
        res.redirect(`/listings/${id}`); //redirecting to view/show route
    }
    //else update without img--
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "Listing Updated without img!"); 
        res.redirect(`/listings/${id}`); //redirecting to view/show route
   
};

module.exports.destroyListing = async(req, res)=>{
    let {id}= req.params;
    let deletedList= await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!"); 
    res.redirect("/listings");
};


// module.exports.sampleListing= async(req, res)=>{
//     let sampleList=  new Listing( {
//         title: "Another Filtering category Villa",
//         description: "Perplexing amidst the snowflakes-its snow and solace ",
//         price: 2500,
//         location: "Zurich",
//         country: "Switzerland",
//         category: "amazing pools",
  
//     })
//     await sampleList.save();
//     console.log(`sample was saved : ${sampleList}`);
//     res.send("successful testing!");
  
//   };