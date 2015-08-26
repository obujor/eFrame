var hbs = require('hbs');

// Get link for a given URI (remove the starting /)
exports.link = function (uri) {
    return uri.substring(1);
};

exports.resource = function(app, name) {
    return '/appsStatic/'+app+'/resources/'+name;
}

exports.userApps = function(args) {
    var data = args.data.root;
    var template = hbs.compile(hbs.handlebars.partials[data.user.username]);
    return template(data);
}