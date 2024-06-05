const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { isUtf8 } = require("buffer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  fs.readdir("./files", function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/addnote", function (req, res) {
  res.render("addnote");
});

app.post("/create", function (req, res) {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.message,
    function (err) {
      res.redirect("/");
    }
  );
});

app.get("/show/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      res.render("notedata", {
        filename: req.params.filename,
        filedata: filedata,
      });
    }
  );
});

app.post("/edit", function (req, res) {
  if (req.body.newTitle.length > 0) {
    fs.rename(
      `./files/${req.body.title}`,
      `./files/${req.body.newTitle}`,
      function (err) {
        fs.writeFile(
          `./files/${req.body.newTitle}`,
          req.body.newMessage,
          (err) => {
            res.redirect("/");
          }
        );
      }
    );
  } else {
    fs.writeFile(`./files/${req.body.title}`, req.body.newMessage, (err) => {
      res.redirect("/");
    });
  }
});

app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    res.redirect("/");
  });
});

app.listen(3000, function () {
  console.log("server is running at port no. 3000");
});
