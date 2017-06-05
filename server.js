//dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
var exphbs = require("express-handlebars");

//to make web scrapping possible
var request = require("request");
var cheerio = require("cheerio");

//here require models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

//Initialize express
var app = express();

//morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//make public a static dir
app.use(express.static("public"));

//Dataase configuration with mongoose
mongoose.connect("mongodb://localhost/website");
var db = mongoose.connection;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//print out errors if mongodb runs into issues
db.on("error", function(error) {
  console.log("Database Error:", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});
// ========================Request functions here========================
app.get("/", function(req, res) {
  var result = {};
  //send something empty
  var hbsObjects = {
    articles: result
  };
  res.render("index");
});

app.get("/articles/saved", function(req, res) {
  res.render("savedArticles");

  // res.render("index",)
});

app.get("/scrape", function(req, res) {

  request("https://la.eater.com/neighborhood/el-monte", function(error, response, html) {
    var $ = cheerio.load(html);
    var result = [];

    $("div.m-entry-box__body").each(function(i, element) {

      //save empty result object
      var resultToMongoose = {};

      //add title, blurb, and link and save them as properties of the result object
      resultToMongoose.title = $(element).find("h3").text();
      resultToMongoose.blurb = $(element).find("p.m-entry-box__blurb").text();
      resultToMongoose.link = $(element).find("a").attr("href");

      //creates a new Artivle model with entry. Article is passed with result
      var entry = new Article(resultToMongoose);
      result.push(entry);
      //entry is saved to the db
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
    var hbsObject = {
      articles: result
    }
    //sends back to app.js
    res.send(result);
    //sends to index.handlebars to render divs
    res.render("index", hbsObject);
  });
});

//call JSON API
app.get("/scrape/api", function(req, res) {
  entry.find({}, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      res.send(found);
    }
  });
});

//Create a new note or replace an existing note
app.get("/article/:id", function(req, res) {
  var newNote = new Note(req.body);

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: doc._id
      }).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.send(doc)
        }
      });
    }
  });
});

// app.get("/article/saved/remove/:id", function(req,res){
//
//
// })
//=============================End========================================
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
