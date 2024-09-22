require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));
app.use(cookieParser("goodVibe"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  next();
});

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  req.flash("success_msg", "Successfully get to the homepage");
  res.send(`Hi! ${req.flash("success_msg")}`);
});

app.get("/verifyUser", (req, res) => {
  req.session.isVerified = true;
  res.send("You are verified.");
});

app.get("/secret", (req, res) => {
  if (req.session.isVerified == true) {
    res.send("I love dogs and cats.");
  } else {
    res.status(403).send("You are not authorized to see my secret.");
  }
});

app.get("/getSignedCookies", (req, res) => {
  res
    .cookie("address", "YongFu Rd.", { signed: true })
    .send("Cookie has been send");
});

// const monkeySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 5,
//   },
// });

// const Monkey = mongoose.model("Monkey", monkeySchema);

// // 處理async需要搭配try－catch
// app.get("/", async (req, res, next) => {
//   try {
//     let data = await Monkey.findOneAndUpdate(
//       { name: "JJJJJ" },
//       { name: "KKKKK" },
//       { new: true, runValidators: true }
//     );
//     if (!data) {
//       return res.status(404).send("Data is not found.");
//     }
//     res.send("Data has been updated.");
//   } catch (e) {
//     next(e);
//   }
// });

app.get("/*", (req, res) => {
  res.status(404).send("Paga not found");
});

//Error handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something is broken! <br> We will fix it soon");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
