//require mongoose
var mongoose = require("mongoose");

//create schema class
var Schema = mongoose.Schema;

//Create Note Schema
var NoteSchema = new Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  written:{
    type: Boolean
  }
});

//create Note model with NoteSchema
var Note = mongoose.model("Note", NoteSchema);

//export Note model
module.exports = Note;
