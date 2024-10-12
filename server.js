const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let messages = [];

io.on('connection', (socket) => {
  console.log('Soporte Técnico: un usuario se ha conectado');
  
  // Enviar mensajes existentes al nuevo usuario
  socket.emit('chat history', messages);

  socket.on('disconnect', () => {
    console.log('Soporte Técnico: un usuario se ha desconectado');
  });

  socket.on('chat message', (msg) => {
    const timestamp = new Date().toLocaleString();
    const messageWithTimestamp = {
      id: messages.length, // Asignar un ID único basado en la longitud del array
      username: msg.username,
      text: msg.text,
      time: timestamp,
      color: msg.color
    };
    messages.push(messageWithTimestamp);
    io.emit('chat message', messageWithTimestamp);
  });

  socket.on('edit message', (msg) => {
    const message = messages.find(m => m.id === msg.id);
    if (message) {
      message.text = msg.text;
      io.emit('edit message', message);
    }
  });

  socket.on('delete message', (id) => {
    messages = messages.filter(m => m.id !== id);
    io.emit('delete message', id);
  });
});

server.listen(3000, () => {
  console.log('Soporte Técnico escuchando en *:3000');
});