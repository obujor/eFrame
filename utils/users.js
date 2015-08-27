var context = require('./context.js'),
    users = require('../config.json').users;

exports.getUserData = function (username) {
    if (users && users[username]) {
        return context.merge({
            username: username
        },users[username]);
    }
    return null;
};