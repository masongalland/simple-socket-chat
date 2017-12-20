import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userID: null,
      messages: [],
      room: 0,
      joined: false
    }

    this.updateMessages = this.updateMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setUserId = this.setUserId.bind(this);

    // EVERYONE IN ROOM
    // this.joinRoom = this.joinRoom.bind(this);
    // this.joinSuccess = this.joinSuccess.bind(this);
  }

  componentDidMount() {
    this.socket = io('/');
    this.socket.on('message dispatched', this.updateMessages)
    this.socket.on('welcome', this.setUserId)
    // EVERYONE IN ROOM
    // this.socket.on('room joined', this.joinSuccess)
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

  // EVERYONE
  sendMessage() {
    this.socket.emit('message sent', {
      message: this.refs.message.value
    })
    this.refs.message.value = '';

  }

  // EVERYONE BUT ME
  // sendMessage() {
  //   this.socket.emit('message sent', {
  //     message: this.state.input
  //   })
  //   this.setState({
  //     message: this.state.input
  //   })
  // }

  // EVERYONE IN ROOM
  // sendMessage() {
  //   this.socket.emit('message sent', {
  //     message: this.state.input,
  //     room: this.state.room
  //   })
  // }
  // joinRoom() {
  //   this.socket.emit('join room', {
  //     room: this.state.room
  //   })
  // }
  // joinSuccess() {
  //   this.setState({
  //     joined: true
  //   })
  // }
  render() {
    console.log(this.state)
    const messages = this.state.messages.map((e,i) => {
      const styles = e.user === this.state.userID ? {alignSelf: "flex-end", backgroundColor: "#2d96fb", color: "white"} : {alignSelf: "flex-start", backgroundColor: "#e5e6ea"}
      return (
        <p key={i} style={styles}>{e.message}</p>
      )
    })

    return (
      // EVERYONE AND EVERYONE BUT ME
      <div className="App">
        <div className="messages">
          {messages}
        </div>
        <div className="input">
          <input ref="message" />
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>

      // EVERYONE IN ROOM
    //   <div className="App">
    //   <h1>{this.state.message}</h1>
    //   <input value={this.state.room} onChange={e => {
    //     this.setState({
    //       room: e.target.value
    //     })
    //   }} />
    //   <button onClick={this.joinRoom}>Join</button>
    //   {this.state.joined
    //   ?
    //   <div>
    //   <input value={this.state.input} onChange={e => {
    //     this.setState({
    //       input: e.target.value
    //     })
    //   }} />
    //   <button onClick={this.sendMessage}>Send</button>
    //   </div>
    //   :
    //   null
    //   }
    // </div>
    );
  }
}

export default App;
