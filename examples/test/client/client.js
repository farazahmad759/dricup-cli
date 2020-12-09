var express = require("express");
var path = require("path");
function register(app) {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/app-1/build")));
    app.get("/app-1", function (req, res) {
      res.sendFile(path.join(__dirname, "./client/app-1/build", "index.html"));
    });
  } else {
    app.get("/app-1", function (req, res) {
      app.get("/app-1", function (req, res) {
        res.sendFile(
          path.join(__dirname, "./client/app-1/build", "index.html")
        );
      });
    });
  }
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/app1/build")));
    app.get("/app1", function (req, res) {
      res.sendFile(path.join(__dirname, "./client/app1/build", "index.html"));
    });
  } else {
    app.get("/app1", function (req, res) {
      app.get("/app1", function (req, res) {
        res.sendFile(path.join(__dirname, "./client/app1/build", "index.html"));
      });
    });
  }
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/app2/build")));
    app.get("/app2", function (req, res) {
      res.sendFile(path.join(__dirname, "./client/app2/build", "index.html"));
    });
  } else {
    app.get("/app2", function (req, res) {
      app.get("/app2", function (req, res) {
        res.sendFile(path.join(__dirname, "./client/app2/build", "index.html"));
      });
    });
  }
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/app3/build")));
    app.get("/app3", function (req, res) {
      res.sendFile(path.join(__dirname, "./client/app3/build", "index.html"));
    });
  } else {
    app.get("/app3", function (req, res) {
      app.get("/app3", function (req, res) {
        res.sendFile(path.join(__dirname, "./client/app3/build", "index.html"));
      });
    });
  }
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "./client/app4/build")));
    app.get("/app4", function (req, res) {
      res.sendFile(path.join(__dirname, "./client/app4/build", "index.html"));
    });
  } else {
    app.get("/app4", function (req, res) {
      app.get("/app4", function (req, res) {
        res.sendFile(path.join(__dirname, "./client/app4/build", "index.html"));
      });
    });
  }
}

let exp = {
  register,
};
module.exports = exp;
