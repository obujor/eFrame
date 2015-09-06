var context = require('../utils/context.js'),
    users = require('../utils/users.js'),
    appsUtils = require('../utils/apps.js');

module.exports = function (req, res, next) {
    var appsData = appsUtils.getAppsData();
    
    if(req.method == 'GET') {
        res.json(appsData);
    } else if (req.method == 'POST') {
        var data = req.body,
            user = req.params.user;

        if (user && data.layout && data.apps.length) {
            users.setUserData(user, data, function(success) {
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