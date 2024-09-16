const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle connection events
io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a room
    socket.on('join-room', (room, username) => {
        socket.join(room);
        socket.username = username;
        io.to(room).emit('user-joined', { username });
    });

    // Handle receiving messages
    socket.on('send-message', (message, room) => {
        io.to(room).emit('receive-message', {
            username: socket.username,
            message
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (socket.username) {
            console.log('User disconnected:', socket.username);
            io.emit('user-left', { username: socket.username });
        } else {
            console.log('User disconnected');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
