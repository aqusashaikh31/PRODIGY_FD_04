const socket = io('http://localhost:3000'); // Connect to the server
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const room = 'general'; // Replace with your desired room name
let username = ''; // Store username globally

// Join the room on connection
socket.on('connect', () => {
  username = prompt('Enter your username:');
  socket.emit('join-room', room, username);
});

// Receive messages
socket.on('receive-message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  
  // Check if the message is from the current user or received
  if (data.username === username) {
    messageElement.classList.add('user');
  } else {
    messageElement.classList.add('received');
  }

  const messageText = document.createElement('span');
  messageText.classList.add('message-text');
  if (data.isImage) {
    messageText.innerHTML = `<img src="${data.message}" alt="Uploaded Image" style="max-width: 100%; height: auto;">`; // Assuming isImage is true for images
  } else {
    messageText.textContent = data.message;
  }
  messageElement.appendChild(messageText);
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
});

// User Joined/Left Notifications
socket.on('user-joined', (data) => {
  const notification = document.createElement('div');
  notification.textContent = `${data.username} joined the chat.`;
  chatMessages.appendChild(notification);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
});

socket.on('user-left', (data) => {
  const notification = document.createElement('div');
  notification.textContent = `${data.username} left the chat.`;
  chatMessages.appendChild(notification);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
});

// Send message
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('send-message', message, room); // Pass username
    messageInput.value = ''; // Clear input
  }
});
