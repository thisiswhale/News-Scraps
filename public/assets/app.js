//button to makes web scrapes, modal this many artcels scrapes
//button to save articles
//button to add article note/comment, modal the cooment, saved and remove it
//button to remove saved

//home tab, saved artibles tab, and scrae new articles button


$(document).on("click", "#btn-scrape", function() {
  $("#collect-modal-input").empty();
  console.log("Scrape button here");
  // $("#article-entry").empty();
  //
  // $.getJSON("/scrape", function(data){
  //   console.log("Scrape button activated: ", data);
  // });
  //$.getJSON
  $.get("/scrape",function(data){
        console.log("Scrape button activated: ", data);
        $("#collect-modal-input").append(data.length + " entries found.");
        $(location).attr("href","/");
  });
  // $.ajax({
  //   type: "GET",
  //   url: "/scrape",
  //   dataType: "json"
  // }).done(function(data) {
  //   console.log("Scrape button activated: ", data);
  //
  //   $("#collect-modal-input").append(data.length + " entries found.")
  //
  // });
});

// $(document).on("click", "#btn-", function() {
