const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTjA0Lpsg840JNGLaPgVWM9QofkvAYdFPLb-g&usqp=CAU",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  savedposts: [{ type: ObjectId, ref: "Post" }],
  verified: String,
  verfiedToken: String,
  expireverifyToken: Date,
});

mongoose.model("User", userSchema);
