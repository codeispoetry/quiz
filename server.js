var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname ));

io.on('connection', function(socket){
  
   socket.on('loadQuestion', function(msg){
        socket.broadcast.emit('loadQuestion', msg);
  });

  socket.on('logInAnswer', function(msg){
    socket.broadcast.emit('logInAnswer', msg);
  });

  socket.on('showAnswers', function(msg){
    socket.broadcast.emit('showAnswers', msg);
  });

  socket.on('action', function(msg){
    socket.broadcast.emit('action', msg);
  });

  socket.on('solve', function(msg){
    socket.broadcast.emit('solve', msg);
  });

  socket.on('showScore', function(msg){
    socket.broadcast.emit('showScore', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});