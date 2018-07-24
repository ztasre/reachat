#!/bin/env node

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 1337 });

let history = [];
let users = []

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', function connections(ws) {
    
    // initial message sent upon connection to server
    ws.send(JSON.stringify(history));
    
    ws.on('message', function incoming(message) {
        console.log(message);
        history.push(JSON.parse(message));
        wss.broadcast(JSON.stringify(history));
    });

});

