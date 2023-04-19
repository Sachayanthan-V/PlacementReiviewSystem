// require all necessary libraries :

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
const expresslayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const routes = require("./routes");
const User = require("./models/user");
const Student = require('./models/student');
const Job = require('./models/job');
const Company = require('./models/company');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const customMware = require('./config/middleware');
 
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static("./assets"));

app.use(expresslayouts);
app.set("layout extractStyles", true); 
app.set("layout extractScripts", true);

app.set("view engine", "ejs"); 
app.set("views", "./views");
 

// to create a new session for users
app.use( session({
    name: "ERS",
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 100 },
    store: MongoStore.create({
          // mongoUrl: "mongodb+srv://sachayanthanv1999:JxeAWchTq21VaerQ@cluster0.ajh9ftk.mongodb.net/?retryWrites=true&w=majority",
          mongoUrl: "mongodb://127.0.0.1:27017/placementCell",
          autoremove: "disabled",
        },
          function (err) { console.log("error at mongo store", err || "connection established to store cookie" ); }
        ),
}));


// initialize passport authentication and sessions
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash()); // using it as notify things.
app.use(customMware.setFlash);
app.use("/", routes);

//create listener for express
app.listen(port, function (error) {
  if (error) {
    console.log(`Error while listening to port :: ${port}`);
    return;
  }
  console.log(`Listening on port ${port}`);
});
