var express = require("express");
var router = express.Router();

const User = require("../models/users");
const Tweet = require("../models/tweet");

router.post("/post/:token", (req, res) => {
  User.findOne({ token: req.params.token })
  .then((data) => {
    if (data) {
      const newTweet = new Tweet({
        content: req.body.content,
        date: new Date(),
        author: data._id,
      });
      newTweet.save().then((newDoc) => {
        res.json({ result: true, tweet: newDoc });
      });
    } else {
      res.json({ result: false, error: "Tweet didn't save" });
    }
  });
});

router.get("/", (req, res) => {
  Tweet.find({})
    .populate("author")
    .then((data) => {
      if (data) {
        res.json({ result: true, tweets: data });
      } else {
        res.json({ result: false, error: "No tweets found" });
      }
    });
});

module.exports = router;
