var express = require("express"),
  app = express(),
  http = require("http"),
  server  = require('http').createServer(app),
  io = require('socket.io').listen(server),
  mongoose = require("mongoose");

app.use(express.static(__dirname + "/client"));
// app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
  description: String,
  tags: [String]
});


var ToDo = mongoose.model("ToDo", ToDoSchema);

server.listen(3000);

app.get("/todos.json", function(req, res) {
  ToDo.find({}, function(err, toDos) {
    res.json(toDos);
  });
});

io.on("connection", function(socket){
  socket.on("todos", function(msg){
    console.log('message: ' + msg);
    var newToDo = new ToDo({
      "description": msg.description,
      "tags": msg.tags
    });
    newToDo.save(function(err, result) {
      if (err !== null) {
        // the element did not get saved!
        console.log(err);
        res.send("ERROR");
      } else {
        // our client expects *all* of the todo items to be returned, so we'll do
        // an additional request to maintain compatibility
        ToDo.find({}, function(err, result) {
          if (err !== null) {
            // the element did not get saved!
            res.send("ERROR");
          }
          // res.json(result);
          io.emit("todos", result);
        });
      }
    });
  });
});

app.post("/todos", function(req, res) {
  console.log(req.body);

});