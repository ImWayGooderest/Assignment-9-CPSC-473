var main = function(viewModel) {
  "use strict";
  var socket = io.connect('http://localhost:3000');
  console.log("SANITY CHECK");
  // var toDos = toDoObjects.map(function(toDo) {
  //   // we'll just return the description
  //   // of this toDoObject
  //   return toDo.description;
  // });
  socket.on("todos", function(result){
    console.log(result);

    //toDoObjects.push(newToDo);
    // toDoObjects = result;

    // update toDos
    // toDos = toDoObjects.map(function(toDo) {
    //   return toDo.description;
    // });
    viewModel.todos.push({description: result.description, tags: result.tags});

    $(".active").trigger("click");//triggers the page to update
  });

  $(".tabs a span").toArray().forEach(function(element) {
    var $element = $(element);

    // create a click handler for this element
    $element.on("click", function() {
      var $content,
        $input,
        $button,
        i;

      $(".tabs a span").removeClass("active");
      $element.addClass("active");
      $("main .content").empty();

      if ($element.parent().is(":nth-child(1)")) {//newest
        $content = $("<ul data-bind='foreach: todos'>\
                        <li><span data-bind='text:description'></span></li>\
                      </ul>");
        // for (i = toDos.length - 1; i >= 0; i--) {
        //   $content.append($("<li>").text(toDos[i]));
        // }
      } else if ($element.parent().is(":nth-child(2)")) {//oldest
        $content = $("<ul>");
        toDos.forEach(function(todo) {
          $content.append($("<li>").text(todo));
        });

      } else if ($element.parent().is(":nth-child(3)")) {//tags
        var tags = [];

        toDoObjects.forEach(function(toDo) {
          toDo.tags.forEach(function(tag) {
            if (tags.indexOf(tag) === -1) {
              tags.push(tag);
            }
          });
        });
        console.log(tags);

        var tagObjects = tags.map(function(tag) {
          var toDosWithTag = [];

          toDoObjects.forEach(function(toDo) {
            if (toDo.tags.indexOf(tag) !== -1) {
              toDosWithTag.push(toDo.description);
            }
          });

          return {
            "name": tag,
            "toDos": toDosWithTag
          };
        });

        console.log(tagObjects);

        tagObjects.forEach(function(tag) {
          var $tagName = $("<h3>").text(tag.name),
            $content = $("<ul>");


          tag.toDos.forEach(function(description) {
            var $li = $("<li>").text(description);
            $content.append($li);
          });

          $("main .content").append($tagName);
          $("main .content").append($content);
        });

      } else if ($element.parent().is(":nth-child(4)")) {
        var $input = $("<input>").addClass("description"),
          $inputLabel = $("<p>").text("Description: "),
          $tagInput = $("<input>").addClass("tags"),
          $tagLabel = $("<p>").text("Tags: "),
          $button = $("<span>").text("+");

        $button.on("click", function() {
          var description = $input.val(),
            tags = $tagInput.val().split(","),
            newToDo = {
              "description": description,
              "tags": tags
            };

          socket.emit("todos", newToDo);

          $input.val("");
          $tagInput.val("");
          // $.post("todos", newToDo, function(result) {
          //   console.log(result);
          //
          //   //toDoObjects.push(newToDo);
          //   toDoObjects = result;
          //
          //   // update toDos
          //   toDos = toDoObjects.map(function(toDo) {
          //     return toDo.description;
          //   });
          //
          //   $input.val("");
          //   $tagInput.val("");
          // });
        });

        $content = $("<div>").append($inputLabel)
          .append($input)
          .append($tagLabel)
          .append($tagInput)
          .append($button);
      }

      $("main .content").append($content);

      return false;
    });
  });




  $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function() {
  $.getJSON("todos.json", function(toDoObjects) {

    var viewModel = {
      todos: ko.observableArray([{
        description: ko.observable(),
        tags: ko.observableArray
      }])
    };
    $.each(toDoObjects, function(index,value){
      viewModel.todos.push({description: value.description, tags: value.tags});
    });
    // viewModel.todos(.description();
    main(viewModel);
    ko.applyBindings(viewModel);
  });
});