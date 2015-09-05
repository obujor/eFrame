var cluster = require('cluster'),
    bodyParser = require('body-parser'),
    Boom = require('boom'),
    express = require('express'),
    hbs = require('hbs'),
    favicon = require('serve-favicon'),
    helpers = require('./utils/helpers.js'),
    appsUtils = require('./utils/apps.js');

// We use cluster and domains for error management:
// on unhandled exception the child process is restarted.
if (cluster.isMaster) {
    startParentProcess();
} else {
    startChildProcess();
}

function startParentProcess () {
    cluster.fork();
    cluster.on('disconnect', function () {
        console.info('Restarting service.');
        cluster.fork();
    });
}

function startChildProcess () {
    app = express();
    app.set('view engine', 'hbs');
    hbs.registerPartials(__dirname + '/views/partials');
    hbs.registerHelper(helpers);

    appsUtils.load(hbs);
    
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
    app.use('/apps/:user?', require('./pages/apps.js'));
    app.use('/:user/:battery(\\d{1,3})/:topic?', require('./pages/page.js'));

    // Error Handling
    app.use(errorHandler);

    // Start server
    module.server = app.listen(require('./config.json').port, function() {
        console.log('Listening on port %d', module.server.address().port);
    });
}

function errorHandler(err, req, res, next) {
    err = Boom.wrap(err, err.status);

    // On server error, force restart.
    if (err.isServer) {
        console.error(err.stack);
        try {
            var killtimer = setTimeout(function() {
                process.exit(1);
            }, 5000);
            killtimer.unref();
            module.server.close();
            cluster.worker.disconnect();
        } catch (er2) {
            console.error('Error sending 500!', er2.stack);
        }
    }

    res.status(err.output.statusCode).end(err.output.payload.message);
}
