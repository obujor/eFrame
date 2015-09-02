var express = require('express');
var app = express();

var Img = require('./img_router.js');

app.use('/img', Img.router);

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Image server listening at http://%s:%s', host, port);
});
