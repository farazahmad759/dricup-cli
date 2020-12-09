var express = require("express");
var path = require("path");
let apps = {
  "app-1": {
    framework: "static",
    route: "/app-1",
  },
};

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
      res.sendFile(path.join(__dirname, "/app-1/build", "index.html"));
    });
  }
  /**
   * APP app-10
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-10/build")));
    app.get("/app-10", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-10/build", "index.html"));
    });
  } else {
    app.get("/app-10", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-10/build", "index.html"));
    });
  }
  /**
   * APP app-11
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-11/build")));
    app.get("/app-11", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-11/build", "index.html"));
    });
  } else {
    app.get("/app-11", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-11/build", "index.html"));
    });
  }
  /**
   * APP app-12
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-12/build")));
    app.get("/app-12", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-12/build", "index.html"));
    });
  } else {
    app.get("/app-12", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-12/build", "index.html"));
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
      res.sendFile(path.join(__dirname, "/app-2/build", "index.html"));
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
      res.sendFile(path.join(__dirname, "/app-3/build", "index.html"));
    });
  }
  /**
   * APP app-4
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-4/build")));
    app.get("/app-4", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-4/build", "index.html"));
    });
  } else {
    app.get("/app-4", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-4/build", "index.html"));
    });
  }
  /**
   * APP app-5
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-5/build")));
    app.get("/app-5", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-5/build", "index.html"));
    });
  } else {
    app.get("/app-5", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-5/build", "index.html"));
    });
  }
  /**
   * APP app-6
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-6/build")));
    app.get("/app-6", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-6/build", "index.html"));
    });
  } else {
    app.get("/app-6", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-6/build", "index.html"));
    });
  }
  /**
   * APP app-7
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-7/build")));
    app.get("/app-7", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-7/build", "index.html"));
    });
  } else {
    app.get("/app-7", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-7/build", "index.html"));
    });
  }
  /**
   * APP app-8
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-8/build")));
    app.get("/app-8", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-8/build", "index.html"));
    });
  } else {
    app.get("/app-8", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-8/build", "index.html"));
    });
  }
  /**
   * APP app-9
   */
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/app-9/build")));
    app.get("/app-9", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-9/build", "index.html"));
    });
  } else {
    app.get("/app-9", function (req, res) {
      res.sendFile(path.join(__dirname, "/app-9/build", "index.html"));
    });
  }
}

let exp = {
  register,
  apps,
};
module.exports = exp;
