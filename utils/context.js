
var baseContext = require('../config.json').baseContext,
    baseContextStr = JSON.stringify(baseContext);

// Merge custom properties with the portal default ones.
exports.create = function (object) {
    var context = JSON.parse(baseContextStr);
    Object.keys(object).forEach(function (key) {
        context[key] = object[key];
    });
    return context;
};