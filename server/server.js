#!/bin/env node

const WebSocket = require('ws');
const uuidv4 = require('uuid/v4')

const wss = new WebSocket.Server({ port: 1337 });

let history = [];

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', function connections(ws) {

    let userid = uuidv4();

    let data = { history: history,
                 id: userid };
    
    // initial message sent upon connection to server
    ws.send(JSON.stringify(data));
    
    ws.on('message', function incoming(message) {
       
        console.log(message);
        var unpacked = JSON.parse(message);

        history.push(unpacked);

        let data = { history: history,
                     id: userid };

        wss.broadcast(JSON.stringify(data));
    });

});
