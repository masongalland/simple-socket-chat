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
  }

  componentDidMount() {
    this.socket = io('/');
    this.socket.on('message dispatched', this.updateMessages)
    this.socket.on('welcome', this.setUserId)
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
      message: this.refs.message.value
    })
    this.refs.message.value = '';
  }

  // EVERYONE BUT ME
  // sendMessage() {
  //   const message = this.refs.message.value
  //   this.socket.emit('message sent', {message})
  //   this.updateMessages({message, user: this.state.userID})
  //   this.refs.message.value = '';
  // }

  render() {
    const messages = this.state.messages.map((e,i) => {
      const styles = e.user === this.state.userID ? {alignSelf: "flex-end", backgroundColor: "#2d96fb", color: "white"} : {alignSelf: "flex-start", backgroundColor: "#e5e6ea"}
      return (
        <p key={i} style={styles}>{e.message}</p>
      )
    })

    return (
      <div className="App">
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
