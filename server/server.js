const express = require('express')
    , socket = require('socket.io');

const app = express()
    , io = socket(app.listen(4000, () => console.log('Server listening on port 4000')));


io.on('connection', socket => {
  console.log('User Connected');
  socket.emit("welcome", {userID: socket.id})

  socket.on('message sent', function(data) {
    console.log(data)
    data.user = this.id
    io.emit('message dispatched', data);
  })

  //  EVERYONE BUT ME
  // socket.on('message sent', function(data) {
  //   data.user = this.id
  //   console.log(data)
  //   socket.broadcast.emit('message dispatched', data);
  // })

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  })
});