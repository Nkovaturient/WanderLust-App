
// *****  SERVER SIDE VALIDATION **** ** after this creating our func validateListing
const Joi = require('joi');

 //schema to be validated
module.exports.listingSchema= Joi.object( {
    listing: Joi.object( {
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required().min(100),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().valid("trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping","farms", "arctic", "domes", "boats")
    }).required(), //Listing naam ki object honi chahiye-- Listing[title/desc/..]-**like this
});


//** after this creating our func validateReview

module.exports.reviewSchema = Joi.object( {
    Review : Joi.object( {
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(), // review obj important Review[rating/comment]
});