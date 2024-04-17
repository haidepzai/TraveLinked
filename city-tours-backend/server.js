const express = require('express');
const http = require('http');

const routing = require('./routes');
const allowCrossDomain = require('./middleware/corsMiddleware');
require('dotenv').config();
require('./config/mongoose');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = require('socket.io')(server, {
   cors: {
      origins: ['http://localhost:4200'],
   },
});

io.use((socket, next) => {
   const username = socket.handshake.auth._id;
   if (!username) {
      return next(new Error('invalid username'));
   }
   socket.username = username;
   next();
});

//Socket.io Connection
io.on('connection', (socket) => {
   console.log('a user connected.');

   //Joining a room
   socket.on('join', (data) => {
      socket.join(data.room); //join room
      console.log(data.user + ' joined the room : ' + data.room);
      //Broadcast this to the room when sonmeone joins:
      socket.broadcast.to(data.room).emit('new user joined', {
         //emit event "new user joined" -> so frontend can listen to that event
         user: data.user,
         message: ' has joined this room.',
      });
   });

   //When someone left the room
   socket.on('leave', (data) => {
      console.log(data.user + ' left the room : ' + data.room);
      socket.broadcast.to(data.room).emit('left room', { user: data.user, message: ' has left this room.' });
      socket.leave(data.room); //leave room
   });

   //On new message
   socket.on('message', (data) => {
      //-> emit new message
      io.in(data.room).emit('new message', {
         user: data.user,
         message: data.message,
         role: data.role,
         _id: data._id,
      });
   });

   //On private message
   socket.on('private message', (data) => {
      console.log('---------------------------');
      console.log('Our User ID: ' + data._id); //= Raum
      console.log('Our Message: ' + data.message);
      console.log('From: ' + data.senderName);
      console.log('To: ' + data.receiverID); //An den Raum des Empfängers (ID vom Empfänger)
      console.log('To: ' + data.receiverName);
      //send message to
      socket.to(data.receiverID).emit('private message', {
         message: data.message,
         from: data._id,
         user: data.senderName,
         _id: data._id,
      });
   });

   socket.on('disconnect', () => {
      console.log('user disconnected');
   });
});

//body-parser
app.use(
   express.urlencoded({
      extended: false,
   })
);
app.use(express.json({ limit: '50mb' }));

//Middlewares
app.use(allowCrossDomain);
//Path to the static files
app.use(express.static(__dirname + '/public'));

//Routes (endpoints):
app.use('/', routing);

server.listen(port, () => {
   console.log('Server listening at port ' + port);
});
