var express = require("express");
var path = require("path");
function register(app) {
  if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, "./client/app-1/build")));
    app.get("/app-1", function (req, res) {
      // res.send({
      //   hh: "dfdf",
      // });
      res.sendFile(path.join(__dirname, "../client/app-1/build", "index.html"));
    });
  }
}

let exp = {
  register,
};
module.exports = exp;
