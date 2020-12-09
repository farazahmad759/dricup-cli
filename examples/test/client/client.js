
          
        var express = require("express");
        var path = require("path");
          let apps = {
          "app-1": {
            framework: "static",
            route: "/app-1"
          },
          
          "app-2": {
            framework: "static",
            route: "/app-2"
          },
          }
        
        function register(app) {
        
          /**
           * APP app-1
           */
          if (process.env.NODE_ENV === "production") {
            app.use(
              express.static(path.join(__dirname, "/app-1/build"))
            );
            app.get("/app-1", function (req, res) {
              res.sendFile(
                path.join(__dirname, "/app-1/build", "index.html")
              );
            });
          }
          else {
            app.get("/app-1", function (req, res) {
                  res.sendFile(
                    path.join(__dirname, "/app-1/build", "index.html")
                  );
                });
              }
          /**
           * APP app-2
           */
          if (process.env.NODE_ENV === "production") {
            app.use(
              express.static(path.join(__dirname, "/app-2/build"))
            );
            app.get("/app-2", function (req, res) {
              res.sendFile(
                path.join(__dirname, "/app-2/build", "index.html")
              );
            });
          }
          else {
            app.get("/app-2", function (req, res) {
                  res.sendFile(
                    path.join(__dirname, "/app-2/build", "index.html")
                  );
                });
              }
          }

          let exp = {
            register,
            apps
          }
          module.exports = exp;
      
          