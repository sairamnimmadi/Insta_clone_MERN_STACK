const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const User = mongoose.model("User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { SENDGRID_API } = require("../config/keys");

const { JWT_SECRET } = require("../config/keys");

const nodemailer = require("nodemailer");

const crypto = require("crypto");

const sendgridTransport = require("nodemailer-sendgrid-transport");

const Verifier = require("email-verifier");
const { VERIFIER_API, REDIRECTION } = require("../config/keys");

let verifier = new Verifier(VERIFIER_API);

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  }),
);

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "please fill all the required fields" });
  }
  verifier.verify(email, (err, result) => {
    if (err) {
      return res.status(422).json({ error: "error" });
    } else if (result.smtpCheck === "false") {
      return res
        .status(404)
        .json({ error: "Email doesn't Exists, Enter a Valid Email" });
    } else {
      User.findOne({ email: email })
        .then((savedUser) => {
          if (savedUser) {
            return res
              .status(422)
              .json({ error: "User With Email Already Exists" });
          }
          crypto.randomBytes(33, (err, buffer) => {
            if (err) console.log(err);
            else {
              const token = buffer.toString("hex");
              bcrypt.hash(password, 13).then((hashedPassword) => {
                const user = new User({
                  email,
                  password: hashedPassword,
                  name,
                  pic,
                  verfiedToken: token,
                  expireverifyToken: Date.now() + 3600000,
                });
                user
                  .save()
                  .then((user) => {
                    transporter.sendMail({
                      to: user.email,
                      from: "liratkohli@gmail.com",
                      subject: "signup success",
                      html: `
                        <h1>Welcome to Insta_clone </h1>
                        <h4>Click on this <a href="${REDIRECTION}/activate/${token}">link</a> to activate your account</h4>
                        `,
                    });
                    res.json({ message: "Saved Successfully" });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add or Email or Password" });
  }
  User.findOne({ email, email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or Password" });
      }
      if (savedUser.verified !== "true") {
        return res.status(422).json({ error: "Activate Your Account First" });
      }
      bcrypt.compare(password, savedUser.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser.id }, JWT_SECRET);
          const {
            _id,
            name,
            email,
            followers,
            following,
            pic,
            savedposts,
          } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic, savedposts },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or Password" });
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(33, (err, buffer) => {
    if (err) console.log(err);
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User doesn't exist with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "liratkohli@gmail.com",
          subject: "Password Reset",
          html: `
          <p>You requested for passwordreset </p>
          <h4>Click on this <a href="${REDIRECTION}/reset/${token}">link</a> to reset password</h4>
          `,
        });
        res.json({ message: "Check Your Email for details" });
      });
    });
  });
});

router.post("/newpassword", (req, res) => {
  const newpassword = req.body.password;
  const senttoken = req.body.token;
  User.findOne({ resetToken: senttoken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Link Expired" });
      }
      bcrypt.hash(newpassword, 13).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password Updated Successfully" });
        });
      });
    })
    .catch((err) => console.log(err));
});

router.post("/activate", (req, res) => {
  const senttoken = req.body.token;
  // console.log(senttoken);
  User.findOne({
    verfiedToken: senttoken,
    expireverifyToken: { $gt: Date.now() },
  })
    .then((user) => {
      // console.log(user);
      if (!user) {
        return res.status(422).json({ error: "Session Expired" });
      }
      user.verified = "true";
      user.verfiedToken = undefined;
      user.expireverifyToken = undefined;
      user.save().then((savedUser) => {
        res.json({ message: "Your Account has Verified Successfully" });
      });
    })
    .catch((err) => console.log(err));
});

router.post("/reactivate", (req, res) => {
  crypto.randomBytes(33, (err, buffer) => {
    if (err) console.log(err);
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User doesn't exist with that email" });
      }
      if (user.verified === "true") {
        return res.json({ message: "Your account is already activated" });
      }
      user.verfiedToken = token;
      user.expireverifyToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "liratkohli@gmail.com",
          subject: "Activate account",
          html: `
          <p>You requested for reactivate your account </p>
          <h4>Click on this <a href="${REDIRECTION}/activate/${token}">link</a> to activate your account</h4>
          `,
        });
        res.json({ message: "Check Your Email for details" });
      });
    });
  });
});

module.exports = router;
