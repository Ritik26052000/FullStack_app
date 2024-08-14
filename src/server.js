const express = require("express");
const connectToDB = require("./configs/db");
const userRouter = require("./routes/userRoute");
const auth = require("./middlewares/auth");
const todoRouter = require("./routes/todoRoute");
const limiter = require("./middlewares/ratelimit");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 9090;
const db_url = process.env.DB_URL;
app.use(express.json());
app.use(express.static("../public"));
app.get("/", (req, res) => {
  res.send("this  is a home route");
});

app.use(limiter);

app.use("/todos", auth, todoRouter);

app.use("/user", userRouter);

app.listen(port, async () => {
  try {
    connectToDB(db_url);
    console.log("we are successfully connected to the database");
    console.log(`server is running at http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
});
