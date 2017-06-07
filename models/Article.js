var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true,
    unique: true
  },
  blurb: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved:{
    type: Boolean,
    required:true,
  },
  note: [{
    //Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    //the objectId refer to the ids in the Note model
    ref: "Note"
  }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
