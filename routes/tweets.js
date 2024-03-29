var express = require("express");
var router = express.Router();

const User = require("../models/users");
const Tweet = require("../models/tweet");
const { response } = require("express");

router.post("/post/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
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
      res.json({ result: false, error: "Tweet didn't saved" });
    }
  });
});

router.get("/:id/:token", (req, res) => {
  console.log("ID : " + req.params.id);
  console.log("TOKEN : " + req.params.token);
  Tweet.findById(req.params.id)
    .populate("author")
    .then((data) => {
      if (req.params.token === data.author.token) {
        Tweet.deleteOne(data).then((deletedDoc) => {
          if (deletedDoc.deletedCount > 0) {
            res.json({ result: true, message: "Tweet deleted" });
          } else {
            res.json({ result: false, message: "Tweet not deleted" });
          }
        });
      }
    });
});

router.get("/", (req, res) => {
  Tweet.find({})
    .populate("author")
    .then((data) => {
      console.log(data);
      if (data) {
        res.json({ result: true, tweets: data });
      } else {
        res.json({ result: false, error: "No tweets found" });
      }
    });
});

module.exports = router;
