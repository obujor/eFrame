var context = require('../utils/context.js'),
    users = require('../utils/users.js'),
    appsUtils = require('../utils/apps.js');

module.exports = function (req, res, next) {
    users.getUserData(req.params.user, function(userData) {
        if (!userData) {
            res.render('userError', context.create({user: req.params.user}));
            return;
        }

        var data = {
            user : userData,
            device: {
                battery : (req.params.battery) ? req.params.battery : 0
            }
        };

        appsUtils.getData(data, function(appsData) {
	    console.info('render ', new Date(), data.user.username, data.device.battery);
            res.render('page', context.create(context.merge(data, appsData)));
        });
    });
};
