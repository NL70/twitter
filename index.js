const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const path = require("path");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const authTokens = {};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  const livereload = require("livereload");
  const connectLivereload = require("connect-livereload");

  // Reload browser when saving frontend code
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(__dirname + "/public");

  // Reload the page when the server has started
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
}

app.use((req, res, next) => {
  const authToken = req.cookies["AuthToken"];
  req.user = authTokens[authToken];
  next();
});

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

// Static files
app.use(express.static("public"));

// app.use("/keyboardsmash", keyboardSmashRouter);
// app.use("/keyboardsmashlibrary", libraryRouter);

const publicPath = path.join(__dirname, "public");

// app.use("/library", (req, res) => {
//   if (req.user) {
//     res.sendFile(publicPath + "/library.html");
//   } else {
//     res.sendFile(publicPath + "/login.html");
//   }
// });

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening`);
});
