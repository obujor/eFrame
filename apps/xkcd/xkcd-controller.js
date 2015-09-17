var request = require('request'),
    context = require('../../utils/context.js');

exports.getData = function (user, device, cb) {

    request('http://xkcd.com/info.0.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            cb(data);
        }
    });
};
