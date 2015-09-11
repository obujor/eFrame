var bodyParser = require('body-parser'),
    Boom = require('boom'),
    express = require('express'),
    hbs = require('hbs'),
    favicon = require('serve-favicon'),
    helpers = require('./utils/helpers.js'),
    appsUtils = require('./utils/apps.js');

app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper(helpers);

appsUtils.load(hbs);

// Enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Middleware
app.use(require('express-domain-middleware'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

// Endpoints
app.use(express.static('static'));
app.use(favicon(__dirname + '/static/favicon.ico'));
app.use('/appsStatic', express.static('apps'));
app.use('/login/:user', require('./pages/login.js'));
app.use('/apps/:user/:app', require('./pages/apps.js'));
app.use('/apps/:user?', require('./pages/apps.js'));
app.use('/:user/:battery(\\d{1,3})/:topic?', require('./pages/page.js'));

// Error Handling
app.use(errorHandler);

// Start server
module.server = app.listen(require('./config.json').port, function() {
    console.log('Listening on port %d', module.server.address().port);
});

function errorHandler(err, req, res, next) {
    err = Boom.wrap(err, err.status);

    if (err.isServer) {
        console.error(err.stack);
    }

    res.status(err.output.statusCode).end(err.output.payload.message);
}
