"use strict";

const http = require("http");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const post = require("./post");
const newHtml = require("./newHtml");
const PORT = process.env.PORT || 8080;

function findUrl(data) {
  if (data === "/" || data === "/index.html" || data === "/favicon.ico") {
    return "index.html";
  } else {
    return data;
  }
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", data => (body += data));

  req.on("end", () => {
    let filePath = path.join(__dirname, "public", findUrl(req.url));
    let extName = path.extname(filePath);
    let contentType = "text/html";
    if (extName === ".css") {
      contentType = "text/css";
    }

    // GET Request
    if (req.method === "GET") {
      fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
          fs.readFile(
            path.join(__dirname, "public", "404.html"),
            "utf8",
            (err, content) => {
              if (err) throw err;
              res.writeHead(200, {
                "Content-Type": "text/html",
                "Content-Length": content.length
              });
              res.write(content);
              res.end();
            }
          );
        } else {
          res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": content.length
          });
          res.write(content);
          res.end();
        }
      });
    }

    // POST Request
    if (req.method === "POST") {
      if (req.url === "/elements") {
        let q = querystring.parse(body);
        let elName = q.elementName;
        let elSymbol = q.elementSymbol;
        let elNum = q.elementAtomicNumber;
        let elDescript = q.elementDescription;

        fs.writeFile(
          path.join(__dirname, "/public", `${elName}.html`),
          post(elName, elSymbol, elNum, elDescript),
          err => {
            if (err) throw err;

            fs.readdir(path.join(__dirname, "/public"), (err, files) => {
              if (err) throw err;

              let count = 0;
              let listOfElements = "\n";
              files.forEach(e => {
                if (
                  path.extname(e) === ".html" &&
                  e !== "404.html" &&
                  e !== "index.html"
                ) {
                  listOfElements += `<li>
  <a href="/${e}">${e.slice(0, -5)}</a>
</li>`;
                  listOfElements += "\n";
                  count++;
                  return;
                }

                fs.writeFile(
                  path.join(__dirname, "/public", "index.html"),
                  newHtml(listOfElements, count),
                  err => {
                    if (err) throw err;
                  }
                );
              });
            });
          }
        );

        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.write(JSON.stringify({ success: true }));
        res.end();
      } else {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.write(JSON.stringify({ success: false }));
        res.end();
      }
    }

    // DELETE Request
    if (req.method === "DELETE") {
      let publicDir = [];

      fs.readdir(path.join(__dirname, "/public"), (err, files) => {
        if (err) throw err;

        files.forEach(e => {
          publicDir.push(e);
        });
      });

      if (publicDir.indexOf(req.url.substr(1))) {
        fs.unlink(path.join(__dirname, "/public", `/${req.url}`), err => {
          if (err) {
            res.writeHead(200, {
              "Content-Type": "application/json"
            });
            res.end(JSON.stringify({ success: false }));
          }
          console.log(`${req.url} was deleted from public directory!`);
        });

        let count = 0;
        let listOfElements = "\n";
        fs.readdir(path.join(__dirname, "/public"), (err, files) => {
          if (err) throw err;

          files.forEach(e => {
            if (
              path.extname(e) === ".html" &&
              e !== "404.html" &&
              e !== "index.html"
            ) {
              listOfElements += `<li>
<a href="/${e}">${e.slice(0, -5)}</a>
</li>`;
              listOfElements += "\n";
              count++;
              return;
            }

            fs.writeFile(
              path.join(__dirname, "/public", "index.html"),
              newHtml(listOfElements, count),
              err => {
                if (err) throw err;

                res.writeHead(200, {
                  "Content-Type": "application/json"
                });
                res.end(JSON.stringify({ success: true }));
              }
            );
          });
        });
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
