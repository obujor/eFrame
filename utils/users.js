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
        if( userData ) {
            context.merge(userData, data);
            updateUserData(username, userData, cb);
        } else {
            cb(false);
        }
    });
};

exports.setUserLayout = function(username, data, cb) {
    exports.getUserData(username, function(userData) {
        if( userData ) {
            var layouts = userData.layouts || {};
            var hours = data.hours;

            data.hours = data.hours.split(',').map(function(h){
                h = h.split('-');
                return {
                    from: h[0],
                    to: h[1]
                };
            });

            layouts[hours] = data;

            context.merge(userData, {
                layouts: layouts
            });
            updateUserData(username, userData, cb);
        } else {
            cb(false);
        }
    });
};

exports.removeUserLayouts = function(username, layoutsToKeep, cb) {
    exports.getUserData(username, function(userData) {
        if( userData ) {
            var layouts = userData.layouts || {};
            var newLayouts = layoutsToKeep.reduce(function(p, c) {
                p[c] = layouts[c];
                return p;
            }, {});
            userData.layouts = newLayouts;
            updateUserData(username, userData, cb);
        } else {
            cb(false);
        }
    });
};

function updateUserData (user, data, cb) {
    var users = db.get('users');
    users.update({username: user}, data, function(err, res) {
        cb((!err && res > 0));
    });
}