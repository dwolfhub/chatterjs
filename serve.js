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

  socket.on('roomchange', function (data) {
    console.log(data);
  });

  socket.on('chat', function (data) {
    console.log(data);
  });

  socket.on('disconnect', function (data) {
    console.log(data);
  });

});