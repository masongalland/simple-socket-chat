# Welcome to Sockets!

This is a simple chat application that used create-react-app to set up the front end and has a node/express.js server. Socket.io is used to facilitate live updates. Below I have listed steps that were taken to create this app.

Note: there is a branch called "rooms" that incorporates using rooms with Socket.io

## Initial Setup

- Use create-react-app cli to get a basic react application up and ready to go.
- create a server.js file for your express app.

- Use npm to install express and socket.io
    ```
    npm install --save express socket.io
    ```
    - Note: installing socket.io will give access to the following packages:
        - socket.io
        - socket.io-adapter
        - socket.io-client
        - socket.io-parser
- Add a "proxy" property to the package.json file with a value equal to the url that your server will be running on. For example:
    ```json
    "proxy": "http://localhost:4000"
    ```

## Server

- Require express and socket.io
     ```javascript
     const express = require('express')
         , socket = require('socket.io');
    ```
- Invoke express and socket, while passing your app.listen invocation as an argument to socket. store both of these in variables.
    ```javascript
        const app = express()
            , io = socket(app.listen(4000, () => console.log('Server listening on port 4000')));
    ```
- Set up a socket instance and listen for events
    - "connection" and "disconnect" are reserved keywords
        ```javascript
        io.on('connection', socket => {
            //...listen for events and emit to connected sockets
            // anything that happens inside this callback function that is not nested inside an event, will happen immediately on connection.
        })
        ```
    - the "socket" parameter of the callback function for io.on('connection') represents the unique socket for an individual connecting from the client side.
        ```javascript
        socket.on('event name', function(data){
            // "data" represents incoming data from the client
            //...do things like perform logic, store data in db, join room, emit data to connected sockets, etc.
        })
        ```

## Front End

- import socket.io-client in the App component
    ```javascript
    import io from 'socket.io-client';
    ```
- Inside the componentDidMount lifecycle method, invoke io passing in the url to your server (since we are using proxy, this can just be "/"). Also set up socket event listeners here.
    ```javascript
    componentDidMount() {
        this.socket = io('/');
        this.socket.on('message dispatched', this.updateMessages)
        this.socket.on('welcome', this.setUserId)
    }
    ```
    - The syntax to listen for events and emit data to the server is the same in the front end as in the back end.
    - see src/App.js for specific examples.

## Rooms

- By tracking the room id you can limit where your emits are going
    - The room id should be tracked in your front end
- Very useful for separating data transfer within your socket instance
- Create a 'join room' event in the callback function of the io.on('connection') event.
    - Inside the 'join room' event's callback function, use the data passed in from the front end to create a room
        ```javascript
        socket.join(data.room);
        ```
    - To emit only to a specific room, do the following:
        ```javascript
        io.to('room name').emit('event name', data);
        ```
- Example:
    ```javascript
    socket.on('join room', data => {
        socket.join(data.room);
        io.to(data.room).emit('room joined', data.room);
    })
  ```


