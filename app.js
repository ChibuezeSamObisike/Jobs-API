/* eslint-disable no-undef */
require("dotenv").config();
require("express-async-errors");
const express = require("express");

//Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//connectDB

const connectDB = require("./db/connect");

const auth = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, // limit each IP to 100 requests per minute
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8500;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
