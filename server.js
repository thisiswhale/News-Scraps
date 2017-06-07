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
app.use(bodyParser.urlencoded({extended: false}));

//make public a static dir
app.use(express.static("public"));

//Database configuration with mongoose
if (process.env.MONGODB_URI) {
  //===========Heroku App==================
  mongoose.connect(process.env.MONGODB_URI);
} else {
  //===========LOCAL=======================
  mongoose.connect("mongodb://localhost/website");
}
var db = mongoose.connection;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({defaultLayout: "main"}));
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
  //send something empty
  Article.find({}, function(error, doc) {
    //    console.log("doc is " +doc);
    if (error) {
      console.log(error);
    } else {
      var hbsObjects = {
        articles: doc
      };
      console.log(hbsObjects);
      res.render("index", hbsObjects);
    }
  });
});

app.get("/scrape", function(req, res) {
  request("https://la.eater.com/neighborhood/woodland-hills", function(error, response, html) {
    var $ = cheerio.load(html);
    var result = [];
    $("div.m-entry-box__body").each(function(i, element) {

      //save empty result object
      var resultToMongoose = {};

      //add title, blurb, and link and save them as properties of the result object
      resultToMongoose.title = $(element).find("h3").text();
      resultToMongoose.blurb = $(element).find("p.m-entry-box__blurb").text();
      resultToMongoose.link = $(element).find("a").attr("href");
      resultToMongoose.saved = false;

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
    //sends back to app.js
    res.send(result);
  });
});

//directs to render all saved articles when saved = true
app.get("/articles/saved/api", function(req, res) {
  Article.find({saved: true}).populate("notes").exec(function(error, doc) {
    if (error) {
      res.send(error);
    } else {
      res.send(doc);
      //console.log(doc.)
    }
  });
});

app.get("/articles/saved/", function(req, res) {
  Article.find({
    saved: true
  }, function(error, data) {
    if (error) {
      console.log(error);
    } else {

      var hbsObjects = {
        articles: data
      };
      console.log(hbsObjects);
      res.render("savedArticles", hbsObjects);
    }
  });
});

app.get("/articles/save/:id", function(req, res) {

  Article.update({
    "_id": req.params.id
  }, {
    $set: {
      saved: true
    }
  }, function(error, edited) {
    if (error) {
      console.log(error)
    } else {
      res.redirect("/");
    }
  });
});

//Create a new note or replace an existing note
app.post("/articles/saved/note/:id", function(req, res) {
  var newNote = new Note({title: req.body.title, body: req.body.body, written: true});

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          "note": doc._id
        }
      }, {
        new: true
      }, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log("article saved");
          res.redirect("/articles/saved");
        }
      });
    }
  });
});

app.post("/articles/saved/:id", function(req, res) {
  Article.findOneAndUpdate({
    "_id": req.params.id
  }, {$set:{saved:false}}, function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.send(doc);
    }
  });

});

//call JSON API for refrence
app.get("/scrape/api", function(req, res) {
  entry.find({}, function(err, found) {
    if (err) {
      console.log(err);
    } else {
      res.send(found);
    }
  });
});

//=============================End========================================
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("App running on port " + PORT + " !");
});
