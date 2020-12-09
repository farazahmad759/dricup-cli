var express = require("express");
var path = require("path");
function register(app) {
  /**
   * APP app-1
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-1/build")));
    app.get("/app-1", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-1/build", "index.html"));
    });
  } else {
    app.get("/app-1", function (req, res) {
      res.send({
        message: "Running development environment",
      });
    });
  }

  /**
   * APP app-2
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-2/build")));
    app.get("/app-2", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-2/build", "index.html"));
    });
  } else {
    app.get("/app-2", function (req, res) {
      res.send({
        message: "Running development environment",
      });
    });
  }

  /**
   * APP app-3
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-3/build")));
    app.get("/app-3", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-3/build", "index.html"));
    });
  } else {
    app.get("/app-3", function (req, res) {
      res.send({
        message: "Running development environment",
      });
    });
  }

  /**
   * APP app-4
   */
  if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, "/app-4/build")));
    app.get("/app-4", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-4/build", "index.html"));
    });
  } else {
    app.get("/app-4", function (req, res) {
      res.send({
        message: "Running development environment",
      });
    });
  }
}

let exp = {
  register,
};
module.exports = exp;
