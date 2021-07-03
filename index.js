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
  console.log(authToken)
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

// get tweet
app.get("/tweets", (req, res) => {
  pool.query(
    "SELECT * FROM tweets ORDER BY datecreated DESC",
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json({ data: results.rows });
    }
  );
});
// post tweet
app.post("/tweets", (req, res) => {
  const { contents, creator_id } = req.body;
  
  if (contents && contents.length <= 280) {
    pool.query(
      "INSERT INTO tweets (content, creator_id) VALUES ($1, $2) RETURNING *",
      [contents, creator_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).json({ data: results.rows[0] });
      }
    );
  }
});

// get user
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json({ data: results.rows });
  });
});

// post user

app.post("/users", (req, res, next) => {
  const { username, password } = req.body;
  const databasePassword = getHashedPassword(password);
  pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    (error, results) => {
      if (error) {
        throw error;
      }
      const user = results.rows[0];
      if (user) {
        if (user.password === databasePassword) {
          const authToken = generateAuthToken();
          authTokens[authToken] = user;
          res.cookie("AuthToken", authToken);
          res.redirect("/");
        } else {
          res.status(400).json({ data: "Incorrect password" });
        }
      } else {
        pool.query(
          "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
          [username, databasePassword],
          (error, results) => {
            if (error) {
              throw error;
            }
            const user = results.rows[0];
            const authToken = generateAuthToken();
            authTokens[authToken] = user;
            res.cookie("AuthToken", authToken);
            res.redirect("/");
          }
        );
      }
    }
  );
});

// Static files
app.use(express.static(__dirname + "/public"));

app.use("/", (req, res, next) => {
  console.log("|" + req.user + "|");
  if (req.user) {
    res.sendFile(publicPath + "/index.html");
  } else {
    res.sendFile(publicPath + "/login.html");
  }
  next()
});

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening`);
});
