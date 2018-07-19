#!/bin/env node

const WebSocket = require('ws');

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

    ws.on('message', function incoming(message) {
        console.log(message);
        history.push(message);
        wss.broadcast(JSON.stringify(history));
    });
    
    /*
    ws.send(JSON.stringify([{ user: "andrei", message: "hello"}
                        , { user: "grumpy", message: "quiet!"}]));
    */
});

//Hello
