var express = require("express");
var router = express.Router();

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const User = require("../models/users");

/* GET users listing. */
router.post("/signup", (req, res) => {
  if (
    req.body.email === "" ||
    req.body.password === "" ||
    req.body.username === ""
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, user: newDoc.email });
      });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, user: data.email });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
