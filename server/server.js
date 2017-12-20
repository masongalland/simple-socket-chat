const express = require('express')
    , socket = require('socket.io');

const app = express()
    , io = socket(app.listen(4000, () => console.log('Server listening on port 4000')));


io.on('connection', socket => {
  console.log('User Connected');
  socket.emit("welcome", {userID: socket.id})

  // EVERYONE
  socket.on('message sent', function(data) {
    console.log(data)
    data.user = this.id
    io.emit('message dispatched', data);
  })


  //  EVERYONE BUT ME
  // socket.on('message sent', data => {
  //   console.log(data)
  //   socket.broadcast.emit('message dispatched', data.message);
  // })


  // EVERYONE IN THE ROOM
  // socket.on('join room', data => {
  //   console.log('Room joined', data.room)
  //   socket.join(data.room);
  //   io.to(data.room).emit('room joined');
  // })
  // socket.on('message sent', data => {
  //   io.to(data.room).emit('message dispatched', data.message);
  // })

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  })
});