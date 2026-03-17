const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Server is running!');
});

let onlineUsers = {};

io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);

    // Handle user joining
    socket.on('userOnline', (username) => {
        onlineUsers[socket.id] = username;
        io.emit('updateOnlineUsers', Object.values(onlineUsers));
    });

    // Handle message sending
    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
    });

    // Handle typing indicators
    socket.on('typing', () => {
        socket.broadcast.emit('userTyping', onlineUsers[socket.id]);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        io.emit('updateOnlineUsers', Object.values(onlineUsers));
        console.log('Client disconnected: ' + socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
