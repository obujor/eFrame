var context = require('../utils/context.js');

module.exports = function (req, res, next) {
    res.render('page', context.create({
        battery: 59
    }));
};