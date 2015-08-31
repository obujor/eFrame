var request = require('request'),
    context = require('../../utils/context.js');

exports.getData = function (user, device, cb) {
    request('http://api.openweathermap.org/data/2.5/weather?units=metric&type=accurate&q='+user.city+'&lang='+user.lang, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            cb(data);
        }
    });
};