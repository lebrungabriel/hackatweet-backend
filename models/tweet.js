const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  content: String,
  date: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Tweet = mongoose.model("tweets", tweetSchema);

module.exports = Tweet;
