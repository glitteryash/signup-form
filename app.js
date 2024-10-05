const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  res.render("login.ejs", { error: null });
});

app.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let data = await User.findOne({ username });

    if (!data) {
      res.render("login.ejs", {
        error: "Incorrect username or password!",
      });
    }

    let match = await bcrypt.compare(password, data.password);
    if (match) {
      res.render("member_exclusive.ejs");
    } else {
      res.render("login.ejs", {
        error: "Incorrect username or password!",
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res, next) => {
  let { username, password } = req.body;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    let newUser = new User({ username, password: hash });
    try {
      await newUser.save();
      res.send("data has been saved");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
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

// (async () => {
//   await User.deleteOne({ username: "aa@fake.com" });
// })();

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
