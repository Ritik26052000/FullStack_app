const { Router } = require("express");
const todoModel = require("../models/todomodel");
const userModel = require("../models/userMode");

const todoRouter = Router();

todoRouter.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 1;
  let query = {};

  if (req.query.title) {
    query.title = req.query.title;
  }
  const user = await userModel({ email: req.user.email });
  console.log(user);
  // const todos = await todoModel.find(query).skip(skip).limit(limit).sort({status:sort})
  const todos = await todoModel.find({}).populate('userId')

  // 1000 -> we can't send all the todos in one go
  // -> UI can't show 1000 todos in one go

  //pagination
  // page
  // limit
  //we have to pass this data in query

  res.json({ todos: todos });
});

todoRouter.post("/", async (req, res) => {
  const { title } = req.body;

  // const todos = await todoModel.find(query).skip(skip).limit(limit).sort({status:sort})

  const user = await userModel.findOne({ email: req.user.email });
  const todo = await todoModel.create({ title, userId: user._id });

  // 1000 -> we can't send all the todos in one go
  // -> UI can't show 1000 todos in one go

  //pagination
  // page
  // limit
  //we have to pass this data in query

  res.json({ message: "todo is created successfully" });
});

module.exports = todoRouter;
