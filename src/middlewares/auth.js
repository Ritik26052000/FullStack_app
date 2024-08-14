const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklistModel");
require("dotenv").config();
const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.json({ message: "token header is not present" });
  }

  const token = header.split(" ")[1];

  // you are the one who giveing the expires 
  // 
  const blacklistCheck = await blackListModel.findOne({ token: token });
  if (blacklistCheck) {
    return res.json({
      message: "this token is blacklisted try to get the new token",
    });
  }
  let decode = jwt.verify(token, process.env.SECRET_KEY,(err,result)=>{
    if(err){
        return res.status(400).json({message:err})
    }
    else{
      req.user = {email:result.email}
      next()
    }
     
  });
  // if (!decode) {
  //   return res.json({ message: "this is not a valid token" });
  // } else {
  //   next();
  // }
};

module.exports = auth;
