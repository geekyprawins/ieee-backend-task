const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
app.set("view engine", "ejs");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");
const Chat = require("./models/chats");
// var userObj = {};
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("Connected to database"));
app.use(
  require("express-session")({
    secret: "Any normal Word", //decode or encode session
    resave: false,
    saveUninitialized: false,
  })
);
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('public'))
// R O U T E S
app.get("/", (req, res) => {
  //   res.sendFile(__dirname + "/public/index.html");

  res.render("home");
});

app.get("/final", (req, res) => {
  if(req.isAuthenticated()){
    // userObj = {user: req.user.username, id: req.user._id};
    res.render("final", {user: req.user});

  }
  else res.send("You are not logged in");
});
// auth routes

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/final",
    failureRedirect: "/signin",
  }),
  (req, res) => {}
);

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.render("signup");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/signin");
      });
    }
  );
});

app.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});
//Getting all texts
app.get("/chat", async (req,res) => {
  let allTexts = await Chat.find({});
  // console.log(allTexts);
  res.render("chat", { allTexts });
})
//Getting data for displaying through ajax
app.get("/chats", async (req,res) => {
  let allTexts = await Chat.find({});
  res.send({ allTexts });
})
//saving text to db
app.post("/chat", async (req,res) => {
  let newText = req.body.text;
  let user = req.body.first;
  const newChat = new Chat({ username: user, text: newText });
  await newChat.save()
    .catch(e => console.log(e))

  res.redirect("/chat");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}
app.listen(port, () => {
  console.log(`Listening began at ${port} 🦻`);
});



