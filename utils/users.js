var context = require('./context.js'),
    Datastore = require('nedb'),
    users = new Datastore({ filename: 'data/users.db', autoload: true });

createTestUser();

function createTestUser() {
    var testUser = {
        username: 'test',
        apps: ['news','weather'],
        city: 'Bologna',
        lang: 'it',
        layout: 'leftright'
    };
    var addUser = function() {
        users.insert(testUser, function(err, user) {
            if (!err) {
                console.info('Test user has been created successfully');
            }
        });
    }
    users.find({username: testUser.username}, function (err, res) {
        if (!err && res.length === 0) {
            addUser();
        }
    });
}

exports.getUserData = function (username, cb) {
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
    layoutsToKeep = (layoutsToKeep == 0) ? [] : layoutsToKeep;
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
    users.update({username: user}, data, function(err, res) {
        cb((!err && res > 0));
    });
}
