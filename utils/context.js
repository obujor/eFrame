var baseContext = require('../config.json').baseContext,
    baseContextStr = JSON.stringify(baseContext);

var merge = function(object1, object2) {
    Object.keys(object2).forEach(function (key) {
        object1[key] = object2[key];
    });
    return object1;
};

// Merge custom properties with the portal default ones.
exports.create = function (object) {
    var context = JSON.parse(baseContextStr);
    merge(context, object);
    return context;
};

exports.merge = merge;