var context = require('../utils/context.js'),
    users = require('../utils/users.js'),
    appsUtils = require('../utils/apps.js');

module.exports = function (req, res, next) {
    var appsData = appsUtils.getAppsData();
    
    if(req.method == 'GET') {
        res.json(appsData);
    } else if (req.method == 'POST') {
        var data = req.body,
            user = req.params.user,
            app = req.params.app;

        if (app && user) {
            var newData = {};
            newData[app] = data;
            users.setUserData(user, newData, function(success) {
                res.json({
                    success: success
                });        
            });
        } else if (user && data.layout && data.apps.length) {
            users.setUserLayout(user, data, function(success) {
                res.json({
                    success: success
                });        
            });
        } else {
            res.json({
                success: false
            });
        }
    }
};