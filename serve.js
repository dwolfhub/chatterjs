'use strict';

var fs = require('fs'),
  url = require('url'),
  path = require('path'),
  mimeTypes = {
    'html': 'text/html',
    'js': 'text/javascript',
    'css': 'text/css'
  },
  httpHandler = function (req, res) {
    // serve static files
    var uri = url.parse(req.url).pathname,
      filename = path.join(process.cwd() + '/web', uri);

    if (typeof path.extname(filename).split('.')[1] === 'undefined') {
      filename = process.cwd() + '/web/index.html';
    }

    var mimeType = mimeTypes[path.extname(filename).split('.')[1]];

    fs.readFile(filename, function (err, data) {
      if (err) {
        res.writeHead(404);
        return;
      }

      res.writeHead(200, {'Content-Type': mimeType});
      res.end(data);
    });
  },
  app = require('http').createServer(httpHandler),
  io = require('socket.io').listen(app);

app.listen(80);

io.sockets.on('connection', function (socket) {

  socket.on('disconnect', function () {
    var room;
    for (room in io.sockets.manager.roomClients[socket.id]) {
      if (room) {
        socket.leave(room.substring(1));
        io.sockets.in(room.substring(1))
          .emit('user-count', io.sockets.clients(room.substring(1)).length);
      }
    }
  });

  socket.on('enter-room', function (room) {
    socket.join(room);
    io.sockets.in(room)
      .emit('user-count', io.sockets.clients(room).length);
  });

  socket.on('chat', function (data) {
    var room;
    for (room in io.sockets.manager.roomClients[socket.id]) {
      if (room) {
        socket.broadcast.to(room.substring(1)).emit('chat', data);
      }
    }
  });

});