const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://lucaboscolo:ambarabacicicoco@cluster0.msmsrta.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.on("connection", () => {
  console.log("Mongoose connected!");
});

const postSchema = {
  title: String,
  content: String,
  author: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      posts: posts,
    });
  });
});

app.get("/scrivi", function (req, res) {
  res.render("scrivi");
});

app.post("/scrivi", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    author: req.body.postAuthor,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      author: post.author,
    });
  });
});

app.get("/il-progetto", function (req, res) {
  res.render("il-progetto", { imgSource: "./images/paper-boat" });
});

app.get("/contatti", function (req, res) {
  res.render("contatti");
});

app.listen(port, function () {
  console.log("Server started on " + port);
});
