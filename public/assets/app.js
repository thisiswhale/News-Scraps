//button to makes web scrapes, modal this many artcels scrapes
//button to save articles
//button to add article note/comment, modal the cooment, saved and remove it
//button to remove saved

//home tab, saved artibles tab, and scrae new articles button

//===================================Scrape Button============================
$(document).on("click", "#btn-scrape", function() {
  event.preventDefault();
  $("#collect-modal-input").empty();
  console.log("Scrape button here");

  $.get("/scrape",function(data){
        console.log("Scrape button activated: ", data);
        $("#collect-modal-input").append(data.length + " entries found.");
        $(location).attr("href","/");
  });
});

//=======================Save Article Button=================================
$(document).on("click", ".save-article", function(event) {
event.preventDefault();
  var thisId = $(this).attr("data-id");
  $(this).attr("data-save", true);
  $.get("/articles/save/"+thisId, function(data){
      alert("Article Saved!");
      $(location).attr("href","/");
  });
});

//============================Save Note Button=================================
$(document).on("click", ".save-note-change", function(event) {
event.preventDefault();
console.log("Save note button works");
  var thisId = $(this).attr("id");
  var title = $(this).find(".save-title").text();
  var body = $(this).find(".save-body").text();

  $.post("/article/saved/note/" +thisId,{
    title: title,
    body: body
  }, function(response){
    alert("Note saved");
  });
});

//======================Remove Save button===================================
$(document).on("click", ".remove-saved", function(event){
  event.preventDefault();

  var thisId = $(this).attr("data-id");
    $(this).attr("data-save", false);

    $.post("/articles/save/"+thisId, function(data){
        alert("Article Removed!");
        $(location).attr("href","/articles/saved");
    });
})
