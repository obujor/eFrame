var context = require('./context.js'),
    db = require('monk')('localhost/eframe');

exports.getUserData = function (username, cb) {
    var users = db.get('users');
    users.find({username: username}, function(err, res) {
        cb(res[0]);
    });
};