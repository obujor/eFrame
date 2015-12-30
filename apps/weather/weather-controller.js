var request = require('request'),
    context = require('../../utils/context.js');

exports.getData = function (user, device, cb) {
    var city = user.weather && user.weather.city || user.city;

    request('http://api.openweathermap.org/data/2.5/forecast?units=metric&type=accurate&q='+city+'&lang='+user.lang, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            cb(data);
        } else 
	    cb({});
    });
};
