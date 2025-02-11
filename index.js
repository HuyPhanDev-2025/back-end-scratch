const express = require("express");
const path = require("path");
const route = require("./routes/client/index.route");
const adMinRoute = require("./routes/admin/index.route");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");

require("dotenv").config();

const methodOverride = require("method-override");

// Middleware for parsing request body sent from form to type: value, ...
const bodyParser = require("body-parser");

const database = require("./config/database");

const systemConfig = require("./config/system");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// ======= Flash =======
app.use(cookieParser("TestFlash"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// ======= End Flash =======

// ======= Tiny MCE for edit, like a small WORD =======
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// ======= End Tiny MCE =======

// App locals variables, just for files .pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

console.log(__dirname);

app.use(express.static(`${__dirname}/public`));

// Use method override to change from post to patch, put, ...
app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
route(app);
adMinRoute(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
