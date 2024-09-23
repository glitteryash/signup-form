const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");

app.set("view engine", "ejs");
// middlewares
app.use(express.static("public"));
app.use((req, res, next) => {
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    let data = await User.findOne({ username });
    if (!data) {
      return res
        .status(404)
        .send("You are not menmber, yet!<br> Please sign up");
    }
    if (password == data.password) {
      res.render("member_exclusive.ejs");
    } else {
      res.send(" Password not correct");
    }
  } catch (e) {
    next(e);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  let { username, password } = req.body;
  let newUser = new User({ username, password });
  try {
    await newUser.save();
    res.send("data has been saved");
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// (async () => {
//   let data = await User.findOneAndDelete({ username: "glitteryash@try" });
//   if (!data) {
//     console.log("data not found");
//   } else {
//     console.log(data);
//   }
// })();

(async () => {
  let data = await User.find();
  if (!data) {
    console.log("data not found");
  } else {
    console.log(data);
  }
})();

// const monkeySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 5,
//   },
// });

// const Monkey = mongoose.model("Monkey", monkeySchema);

// 處理async需要搭配try－catch
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
