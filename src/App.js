import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userID: null,
      messages: []
    }

    this.updateMessages = this.updateMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setUserId = this.setUserId.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.joinSuccess = this.joinSuccess.bind(this);
  }

  componentDidMount() {
    this.socket = io('/');
    this.socket.on('message dispatched', this.updateMessages)
    this.socket.on('welcome', this.setUserId)
    this.socket.on('room joined', this.joinSuccess)
    this.joinRoom()
  }

  updateMessages(message) {
    const updatedMessages = this.state.messages.slice()
    updatedMessages.push(message)
    this.setState({
      messages: updatedMessages
    })
  }

  setUserId(user) {
    this.setState(user)
  }

  sendMessage() {
    this.socket.emit('message sent', {
      message: this.refs.message.value,
      room: this.refs.room.value
    })
    this.refs.message.value = '';
  }

  joinRoom() {
    this.socket.emit('join room', {
      room: this.refs.room.value
    })
    this.setState({messages: []})
  }

  joinSuccess(room) {
    console.log("you successfully joined room " + room)
  }

  render() {
    const messages = this.state.messages.map((e,i) => {
      const styles = e.user === this.state.userID ? {alignSelf: "flex-end", backgroundColor: "#2d96fb", color: "white"} : {alignSelf: "flex-start", backgroundColor: "#e5e6ea"}
      return (
        <p key={i} style={styles}>{e.message}</p>
      )
    })

    return (
      <div className="App">
        <header>
          <select ref="room" defaultValue="1" onChange={this.joinRoom}>
            <option> 1 </option>
            <option> 2 </option>
          </select>
        </header>
        <div className="messages">
          {messages}
        </div>
        <div className="input">
          <input ref="message" />
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default App;
