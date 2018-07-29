import React, { Component } from 'react';
import './App.css';
import uuidv4 from 'uuid/v4';

function idGenerator() {
    return uuidv4();
}

//Works, but it's a bit clunky. 
function UserList(props) {

    let users = {};

    props.history.map( item => {
        if (users.hasOwnProperty(item.id)) {
            let temp = users[item.id];

            if (temp[temp.length - 1] !== item.user) {
                users[item.id].push(item.user);
            }
        } else {
            users[item.id] = [item.user];
        }}
    );

    function latestUsers(userhist) {
        let latest = [];
        for (var property in userhist) {
            if (userhist.hasOwnProperty(property)) {

                let temp = userhist[property];

                latest.push(temp[temp.length - 1]);
            }
        }
        return latest;
    }
    
    const latest = latestUsers(users);
    
    const usersList = latest.map( (user) => 
        <li key={user.toString()}>
            {user}
        </li>
    );

    return (
        <div id="user-list">
        <ul>{usersList}</ul>
        </div>
    );
}

function MessageList(props) {
    
    const elements = props.history.map( (item) =>
            <li key={idGenerator()}>
                {item.user}: {item.message}
            </li>
        );

    return (
        <div id="messages-box">
        <ul>{elements}</ul>
        </div>
    );
}

class UserSettings extends Component {
    constructor(props) {
        super(props);

        this.state = { username: this.props.user };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState( { username: event.target.value } );
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.userChange(this.state.username);
    }

   render() {
       return (
           <div id="settings-area">
           <p>Settings</p>
           <form id="user-settings" onSubmit={this.handleSubmit}>
           <label>
           name: 
           <input id="settings-input"
                  type="text"
                  value={this.state.username}
                  onChange={this.handleChange} />
           </label>
           <input type="submit" value="Change" />
           </form>
           </div>
       )
   }
}

class MessageBox extends Component {
    constructor(props) {
        super(props);

        this.state = { message: '' };
        this.handleChange = this.handleChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
      //this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({ message: event.target.value })
        event.preventDefault();
    }
    
    /*
    handleSubmit(event) {
        this.props.socket.send(JSON.stringify(
            this.state));

        event.preventDefault();

        this.setState({ message: '' });
    }
    */

    onEnterPress(event) {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();

            var data = { user: this.props.user,
                         message: this.state.message,
                         id: this.props.id }

            this.props.socket.send(JSON.stringify(data));

            this.setState({ message: '' });
        }
    }

    render() {
        return (
            <form>
                <textarea id="message-enter"
                       type="text" 
                       value={this.state.message}
                       onChange={this.handleChange}
                       onKeyDown={this.onEnterPress}
                />
            </form>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ws: new WebSocket('ws://localhost:1337'),
            history: [],
            user: 'default',
        }
        
        // Collection of event handlers for WebSockets.
        this.state.ws.onopen = () => {
            console.log('connection established')
        }

        this.state.ws.onmessage = (e) => {
            //console.log(e.data)
            let data = JSON.parse(e.data);
            
            this.setState({
                history: data.history,
                id: data.id,
            })
        }


        this.state.ws.onerror = (e) => {
            console.log('temp error');
        }

        this.state.ws.onclose = (e) => {
            console.log('temp close');
        }

        this.handleUserChange = this.handleUserChange.bind(this);
    }

    handleUserChange(username) {
        this.setState({ user: username});
    }

  render() {
    return (
        <div>
        <section className="side-pane">
        <UserList history={this.state.history}/>
        <UserSettings userChange={this.handleUserChange}
                      user={this.state.user}/>
        </section>
        <section className="center-pane">
        <MessageList history={this.state.history}/>
        <MessageBox socket={this.state.ws}
                    user={this.state.user}
                     id={this.state.id}/> 
        </section>
        </div>
    );
  }
}

export default App;
