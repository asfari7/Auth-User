const express = require("express");
const cors = require("cors");
const session = require("express-session");
const indexRoutes = require("./routes/indexRoutes");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 * 24, secure: false, sameSite: "strict" },
  })
);
app.use(indexRoutes);

app.get("/", (req, res) => {
  res.send("server is running");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
