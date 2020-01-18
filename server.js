var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname ));

io.on('connection', function(socket){

  socket.on('action', function(msg){
    socket.broadcast.emit('action', msg);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});