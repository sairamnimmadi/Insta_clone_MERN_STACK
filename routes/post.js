const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const requireLogin = require("../middleware/requirelogin");
const requirelogin = require("../middleware/requirelogin");

const Post = mongoose.model("Post");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name pic")

    .populate("comments.postedBy", "_id name pic")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name pic")

    .populate("comments.postedBy", "_id name pic")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic, profilepic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please Add all the fields" });
  }

  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    photo: pic,
    profilepic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("PostedBy", "_id name pic")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  )
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    },
  )
    .populate("comments.postedBy", "_id name pic")

    .populate("postedBy", "_id name pic")

    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requirelogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => res.json(result))
          .catch((err) => console.log(err));
      }
    });
});

router.put("/deletecomment", requirelogin, (req, res) => {
  // console.log(req.body.commentId, req.body.commentId);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: {
        comments: { _id: req.body.commentId },
      },
    },
    {
      new: true,
    },
  )
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        // console.log(result);
        res.json(result);
      }
    });
});

router.get("/showsavedposts", requireLogin, (req, res) => {
  Post.find({ _id: { $in: req.user.savedposts } })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
