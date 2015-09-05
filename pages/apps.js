var context = require('../utils/context.js'),
    appsUtils = require('../utils/apps.js');

module.exports = function (req, res, next) {
    var appsData = appsUtils.getAppsData();
    
    if(req.method == 'GET') {
        res.json(appsData);
    } else if (req.method == 'POST') {
        var data = req.body;
        var result = {success: false};

        if (data.layout && data.apps.length) {
            result.success = true;
        }
        res.json(result);
    }
};