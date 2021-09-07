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
const Chats = require("./models/chats");


mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
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
// R O U T E S
app.get("/", (req, res) => {
  //   res.sendFile(__dirname + "/public/index.html");

  res.render("home");
});

app.get("/final", (req, res) => {
  res.render("final");
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
        res.redirect("/final");
      });
    }
  );
});

app.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});


app.get("/chat", (req,res) => {
  res.render("chat");
})
app.post("/chat", (req,res) => {
  let newText = req.body.text;

  const newChat = new Chats({ username: 'NA', text: newText });
  newChat.save(function (err) {
  if (err) return handleError(err);
  });

  res.redirect("/chat");
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}
app.listen(port, () => {
  console.log(`Listening began at ${port} 🦻`);
});
