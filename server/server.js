#!/bin/env node

const WebSocket = require('ws');
const uuidv4 = require('uuid/v4')

const wss = new WebSocket.Server({ port: 1337 });

let history = [];

/* TODO
 
 - Setting up ssl and with the server.

 https://github.com/websockets/ws/blob/master/examples/ssl.js

 - Figure out the bug with the userlist and uuid's

 */

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

function timeStamp(obj) {

    /* Takes a Date object as input and creates a
     * custom timestamp.
     */
    var parts = obj.toLocaleString().split(',');
    return parts[0] + parts[1].slice(0, parts[1].length - 1);
}

wss.on('connection', function connections(ws) {

    let userid = uuidv4();
    console.log(userid);

    let data = { history: history,
                 id: userid };
    
    // initial message sent upon connection to server
    ws.send(JSON.stringify(data));
    
    ws.on('message', function incoming(message) {
       
        console.log(message);
        var unpacked = JSON.parse(message);
        unpacked.timestamp = timeStamp(new Date());

        history.push(unpacked);

        let data = { history: history,
                     id: userid };

        wss.broadcast(JSON.stringify(data));
    });

});
