var express = require('express'),
	path = require('path'),
	weather = require('./getImage');
var router = express.Router();


router.get('/:batteryPerc.:format', function (req, res, next) {
	var battPerc = req.params.batteryPerc;
	console.log('Request('+req.connection.remoteAddress+'): '+ new Date() + ', '+battPerc);
	weather.get(battPerc, req.params.format, function(data) {
		if ( typeof data == 'string' ) {
			res.sendFile(data, { root: path.join(__dirname, '.') });
		} else {
			res.json(data);
		}
	});
});

exports.router = router;
