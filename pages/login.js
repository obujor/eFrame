var context = require('../utils/context.js'),
    users = require('../utils/users.js');

module.exports = function (req, res, next) {
    var user = req.params.user;

    users.getUserData(user, function(data) {
        res.json({
            success: data != null
        });
    });
};