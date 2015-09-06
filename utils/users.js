var context = require('./context.js'),
    db = require('monk')('localhost/eframe');

exports.getUserData = function (username, cb) {
    var users = db.get('users');
    users.find({username: username}, function(err, res) {
        cb(res[0]);
    });
};

exports.setUserData = function (username, data, cb) {
    exports.getUserData(username, function(userData) {
        var users = db.get('users');
        if( userData ) {
            context.merge(userData, data);
            users.update({username: username}, userData, function(err, res) {
                cb((!err && res > 0));
            });
        } else {
            cb(false);
        }
    });
};