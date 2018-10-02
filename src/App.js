import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      userID: null,
      messages: [],
      userInput: '',
      room: '1',
    };
  }

  componentDidMount() {
    this.socket = io('/');
    this.socket.on('message dispatched', this.updateMessages);
    this.socket.on('welcome', this.setUserId);
    this.socket.on('room joined', this.joinSuccess);
    this.joinRoom('1');
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
      room: this.state.room,
    });
    this.setState({ userInput: '' });
  };

  joinRoom = room => {
    this.socket.emit('join room', { room });
    this.setState({ messages: [], room });
  };

  joinSuccess(room) {
    console.log('you successfully joined room ' + room);
  }

  render() {
    const { messages, userInput, userID, room } = this.state;
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
        <header>
          <h3>select a room: </h3>
          <select value={room} onChange={e => this.joinRoom(e.target.value)}>
            <option> 1 </option>
            <option> 2 </option>
          </select>
        </header>
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
