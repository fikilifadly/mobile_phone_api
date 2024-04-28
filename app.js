require("dotenv").config();

const express = require("express");
const cors = require("cors");
const router = require("./routers");
const errorHandler = require("./middlewares/ErrorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use(errorHandler);

module.exports = app;
