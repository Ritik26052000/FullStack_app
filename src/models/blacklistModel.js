const { Schema, model } = require("mongoose");

const blacklistSchema = new Schema({
  token: { type: String, required: true },
});

const blackListModel = model("tokenblacklist", blacklistSchema);

module.exports = blackListModel;

// what are the this.props.

// Schema ->

//     username -> string , required:true
//     email: string , requried:true
//     password:
