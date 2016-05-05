var main = function() {
  "use strict";

  var addCommentFromInputBox = function() {
    var $new_comment;

    if ($(".comment-input input").val() !== "") {
      viewModel.comments.push($(".comment-input input").val());
      $(".comment-input input").val("");

    }
  };

  $(".comment-input button").on("click", function(event) {
    addCommentFromInputBox();
  });

  $(".comment-input input").on("keypress", function(event) {
    if (event.keyCode === 13) {
      addCommentFromInputBox();
    }
  });

  var viewModel = {
    comments: ko.observableArray([
      "comment1",
      "Hello World",
      "testtest"
    ])
  };
  ko.applyBindings(viewModel);

};

$(document).ready(main);