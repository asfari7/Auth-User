const express = require("express");
const cors = require("cors");
const session = require("express-session");
const indexRoutes = require("./routes/indexRoutes");

const app = express();
const corsOptions = {
  origin: ["https://auth-user-psi.vercel.app", "http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000 * 24,
      secure: false,
      httpOnly: true,
      sameSite: "none",
    },
  })
);
app.use(indexRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Auth API" });
  res.send("Welcome to the Auth API");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
