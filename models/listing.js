const mongoose= require("mongoose");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;

const listingSchema= new Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description: String,
        image: {
            type: Object,
            url: String,
            filename: String,
        },
        price: Number,
        location: String,
        country: String,
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            },
        ],
        owner : { //not array cuz ek listing ka ek hi owner hoga
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        category: {
            type: String,
            enum: ["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping","farms", "arctic", "domes", "boats"],
        },
        geometry: {
            type: {
                type: String,  
                enum: ['Point'], //only accepts this 'point' str value
                required:true,
    
            },
            coordinates:{
                type: [Number],
                required:true,
            }
        }
    }
);

//adding POST mongoose middleware to tackle deleting hotel reviews simultaneously from db when that entire listing is del 
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){ //agar koi listing aayi hai
        await Review.deleteMany( {id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;