const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const cloudinary = require("cloudinary");

const requireLogin = require("../middleware/requirelogin");

const { json } = require("express");

const Post = mongoose.model("Post");

const User = mongoose.model("User");

cloudinary.config({
  cloud_name: "cloneinsta",
  api_key: "268761656681155",
  api_secret: "XuSZvPTBnAwr14KrKY0Qhx4j0y8",
});

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        },
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => {
          return res.json({ error: err });
        });
    },
  );
});
router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        },
      )
        .select("-password")
        .then((result) => res.json(result))
        .catch((err) => {
          return res.json({ error: err });
        });
    },
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic cannot be posted" });
      } else res.json(result);
    },
  );
});

router.put("/editprofile", requireLogin, (req, res) => {
  if (req.body.pic !== req.body.oldpic) {
    console.log(req.body.pic, req.body.oldpic, req.body.publicId);
    cloudinary.v2.uploader.destroy(req.body.publicId);
  }
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { name: req.body.name, pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(422).json({ error: "cannot be Deleted" });
      } else res.json(result);
    },
  );
});

router.put("/deleteprofilepic", requireLogin, (req, res) => {
  cloudinary.v2.uploader.destroy(req.body.publicId);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(422).json({ error: "cannot be Deleted" });
      } else res.json(result);
    },
  );
});

router.put("/savedposts", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $push: { savedposts: req.body.id },
    },
    {
      new: true,
    },
  )
    .select("-password")
    .then((result) => res.json(result))
    .catch((err) => {
      return res.json({ error: err });
    });
});

router.put("/deletesavedposts", requireLogin, (req, res) => {
  console.log(req.body.id);
  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        savedposts: req.body.id,
      },
    },
    {
      new: true,
    },
  )
    .select("-password")
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      return res.json({ error: err });
    });
});

module.exports = router;
