const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const port = process.env.PORT || 3000;

require('./src/config/database');
const user_routes = require('./src/user/users.routes');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/user', user_routes); // lowercase alias
app.use('/User', user_routes);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('send_message', (data) => {
    console.log('received message in server side', data);
    io.emit('received_message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});