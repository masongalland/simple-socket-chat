const express = require('express')
    , socket = require('socket.io');

const app = express()
    , io = socket(app.listen(4000, () => console.log('Server listening on port 4000')));


io.on('connection', socket => {
  console.log('User Connected');
  socket.emit("welcome", {userID: socket.id})

  socket.on('join room', data => {
    console.log('Room joined', data.room)
    socket.join(data.room);
    io.to(data.room).emit('room joined', data.room);
  })

  socket.on('message sent', function(data) {
    data.user = this.id
    io.to(data.room).emit('message dispatched', data);
  })

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  })
});