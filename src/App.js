import React, { Component } from 'react';
import './App.css';

function MessageList(props) {

    //console.log(props.messages[0])
    //add {item.user} later
    
    const elements = props.history.map( (item) =>
            <li key={item.toString()}>
                {item}
            </li>
        );

    return (
        <div id="messages-box">
        <ul>{elements}</ul>
        </div>
    );
}

class MessageBox extends Component {
    constructor(props) {
        super(props);

        this.state = { message: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({ message: event.target.value });
        event.preventDefault();
    }

    handleSubmit(event) {
        this.props.socket.send(this.state.message);
        event.preventDefault();

        this.setState({ message: '' });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input id="message-enter"
                       type="text" 
                       value={this.state.message}
                       onChange={this.handleChange} />
            </form>
        );
    }
}
/*
<input id="message-send"
                       type="submit"
                       value="send" />
                       */

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ws: new WebSocket('ws://localhost:1337'),
            history: [],
        }
        
        // Collection of event handlers for WebSockets.
        this.state.ws.onopen = () => {
            console.log('connection established')
            //this.state.ws.send('connection established')
        }

        this.state.ws.onmessage = (e) => {
            //console.log(e.data)
            this.setState({
                history: JSON.parse(e.data)
            })
            //console.log(this.state.history);
        }


        this.state.ws.onerror = (e) => {
            console.log('temp error');
        }

        this.state.ws.onclose = (e) => {
            console.log('temp close');
        }
    }
  render() {
    return (
        <div>
        <MessageList history={this.state.history}/>
        <MessageBox socket={this.state.ws} /> 
        </div>
    );
  }
}

export default App;
