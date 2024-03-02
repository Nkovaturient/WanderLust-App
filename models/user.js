const mongoose= require("mongoose");

const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); 

const userSchema = new Schema( {
      email: {
        type: String,
        required: true,
      }
});

userSchema.plugin(passportLocalMongoose); //automatically adds username, hash, and salt field to store their values alongside,
//irrespective of whether we define username, hash, salt docs in our schema or not

module.exports = mongoose.model("User", userSchema );