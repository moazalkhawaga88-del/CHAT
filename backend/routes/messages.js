const express = require('express');
const router = express.Router();

let messages = []; // In-memory storage for messages

// Get messages between two users
router.get('/messages/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const userMessages = messages.filter(message => 
        (message.from === user1 && message.to === user2) || 
        (message.from === user2 && message.to === user1)
    );
    res.json(userMessages);
});

// Send a message from one user to another
router.post('/messages', (req, res) => {
    const { from, to, content } = req.body;
    const newMessage = { from, to, content, timestamp: new Date() };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// Delete a message by index
router.delete('/messages/:index', (req, res) => {
    const { index } = req.params;
    if (index >= 0 && index < messages.length) {
        messages.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Message not found');
    }
});

module.exports = router;