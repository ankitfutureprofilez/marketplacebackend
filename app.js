const dotenv = require("dotenv");
dotenv.config();

require("./prismaconfig");
const express = require("express");
const app = express();
app.use(express.json({ limit: "2000mb" }));

const cors = require("cors");
const serverless = require('serverless-http');

const corsOptions = {
  origin: "*", // Allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "*", // Allow all headers
  credentials: true,
  optionsSuccessStatus: 200, // for legacy browsers
};
app.use(cors(corsOptions));

app.use("/api", require("./route/UserRoute"));

app.use(express.urlencoded({ extended: true, limit: "2000mb" }));

const PORT = process.env.REACT_APP_SERVER_DOMAIN || 5000;

app.get("/", (req, res) => {
  res.json({
    msg: "Hello Market Places Backend",
    status: 200,
  });
});
const server = app.listen(PORT, () =>
  console.log("Server is running at port : " + PORT)
);
// server.timeout = 360000;
module.exports = serverless(app);
