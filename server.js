var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var qs = require('querystring');

// var usersPath = __dirname + "/users";

var usersPath = path.join(__dirname, "users/");

var server = http.createServer(handleRequest);

function handleRequest(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var store = "";

  req.on("data", (c) => {
    store += c;
  });

  req.on("end", () => {
    var username = JSON.parse(store).username;

    //CREATE 
    if (req.method === "POST" && parsedUrl.pathname === "/users") {

      console.log(usersPath + username + ".json");

      fs.open(usersPath + username + ".json", "wx", (err, fd) => {

        if (err) return console.log(err);

        fs.writeFile(fd, store, (err) => {
            if(err) throw err;

          fs.close(fd, (err) => {
            if(err) throw err;

            res.end(username + "created successfully");
          });
        });
      });

      // READ
    } else if (req.method === "GET" && parsedUrl.pathname === '/users') {

        
        fs.open(usersPath + username + '.json', 'r', (err, fd) => {
          if(err) throw err;

          fs.readFile(fd, (err, data) => {
            if(err) throw err;

              fs.close(fd, (err) => {
                if(err) throw err;
                
                res.end(data);
              } );
          });
        });
        // EDIT 
    } else if (req.method === "PUT" && parsedUrl.pathname === '/users') {
        fs.open(usersPath + username + '.json', 'r+', (err, fd) => {
          if(err) throw err;

          fs.writeFile(fd, store, (err) => {
            if(err) throw err;
            
            fs.close(fd, (err) => {
              if(err) throw err;
              res.end(store);
            } )
            
          })
        })
        //DELETE
    } else if (req.method === "DELETE" && parsedUrl.pathname === '/users') {
      fs.unlink(usersPath + username + '.json', () => {
        res.end('File successfully deleted');
      })
    } else {
      res.statusCode = 404;
      res.end("Page Not Found");
    }
  });
}

server.listen(3002, () => {
  console.log("server started");
});