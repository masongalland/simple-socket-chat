import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userID: null,
      messages: [],
      userInput: '',
    };
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('message dispatched', this.updateMessages);
    this.socket.on('welcome', this.setUserId);
    axios.get('/test').then(res => {
      console.log(res);
    });
  }

  handleInput = e => {
    this.setState({ userInput: e.target.value });
  };

  handleEnter = e => {
    if (e.key !== 'Enter') return;
    this.sendMessage();
  };

  updateMessages = message => {
    const updatedMessages = this.state.messages.slice();
    updatedMessages.push(message);
    this.setState({
      messages: updatedMessages,
    });
  };

  setUserId = user => {
    this.setState(user);
  };

  sendMessage = () => {
    this.socket.emit('message sent', {
      message: this.state.userInput,
    });
    this.setState({ userInput: '' });
  };

  // EVERYONE BUT ME
  // sendMessage() {
  //   const message = this.state.userInput
  //   this.socket.emit('message sent', {message})
  //   this.updateMessages({message, user: this.state.userID})
  //ß  this.setState(() => ({ userInput: '' }));
  // }

  render() {
    const { messages, userInput, userID } = this.state;
    const messagesToDisplay = messages.map((e, i) => {
      const styles =
        e.user === userID
          ? { alignSelf: 'flex-end', backgroundColor: '#2d96fb', color: 'white' }
          : { alignSelf: 'flex-start', backgroundColor: '#e5e6ea' };
      return (
        <p key={i} style={styles}>
          {e.message}
        </p>
      );
    });

    return (
      <div className="App">
        <div className="messages">{messagesToDisplay}</div>
        <div className="input">
          <input value={userInput} onChange={this.handleInput} onKeyPress={this.handleEnter} />
          <button onClick={this.sendMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default App;
