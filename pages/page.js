var context = require('../utils/context.js'),
    users = require('../utils/users.js'),
    appsUtils = require('../utils/apps.js');

module.exports = function (req, res, next) {
    //To merge with the information of the DB
    var data = {
        user : context.merge({
            topic: req.params.topic
        }, users.getUserData(req.params.user)),
        device: {
            battery : (req.params.battery) ? req.params.battery : 0
        }
    };

    appsUtils.getData(data, function(appsData) {
        res.render('page', context.create(context.merge(data, appsData)));
    });
};