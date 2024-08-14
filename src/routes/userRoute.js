const { Router } = require("express");
const userModel = require("../models/userMode");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklistModel");
require("dotenv").config();
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //once you got the email
    // -> this is email new -> correct
    // -> this is email is already used ;

    const check = await userModel.findOne({ email: req.body.email });

    if (check) {
      return res
        .status(400)
        .json({ message: "this is email is already registered try to login " });
    }

    // if reached here that mean user is new

    // we need to hash the password

    // const slatround = bcrypt.genSalt()

    // salt rounds , 5

    // 123123 -> #q2321312321, #12342341234134#

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) console.log(err);

      const user = await userModel.create({
        username: username,
        email: email,
        password: hash,
      });
      res.status(201).json({ message: "user is registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // first check is user email is present in our db or not

    const check = await userModel.findOne({ email: req.body.email });

    if (!check) {
      return res.status(400).json({
        message: "this is email is not  registered try to register your self ",
      });
    }

    bcrypt.compare(password, check.password, (err, result) => {
      if (err) console.log(err);
      const payload = { email: check.email };
      if (result) {
      const access_token =   jwt.sign(
          payload,
          process.env.SECRET_KEY,
        );

          const refresh_token = jwt.sign(
            payload,
            process.env.SECRET_KEY,
            { expiresIn: "5min" },
          );
          res.json({access_token,refresh_token})
      } else {
        return res.status(400).json({
          message: "user info is not correct try to check the details ",
        });
      }
      //
    });
    // after login you will a token .
    // token ->
    //we have the compare the password user given and the password is store in db;
    // console.log(password, check.password);

    // we have to give a token to the user
    // when user is making a request , we will get the token .
    // we can store any info inside the token .
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.json({ message: "token header is not present" });
    }
    const token = header.split(" ")[1];
    const blacklist = await blackListModel.create({ token });
    res.status(200).json({ message: "user is logout successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
