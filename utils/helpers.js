var hbs = require('hbs'),
    fs = require('fs');

// Get link for a given URI (remove the starting /)
exports.link = function (uri) {
    return uri.substring(1);
};

exports.resource = function(app, name) {
    return '/appsStatic/'+app+'/resources/'+name;
}

exports.userApps = function(args) {
    var data = args.data.root,
        templateStr = fs.readFileSync(__dirname+'/../views/users/'+data.user.username+'.hbs', 'utf8'),
        template = hbs.compile(templateStr);
    return template(data);
}

exports.eachSliced = function(context, block) {
    var ret = "",
        offset = parseInt(block.hash.offset) || 0,
        limit = parseInt(block.hash.limit) || 5,
        i = (offset < context.length) ? offset : 0,
        j = ((limit + offset) < context.length) ? (limit + offset) : context.length;

    for(i,j; i<j; i++) {
        ret += block.fn(context[i]);
    }

    return ret;
}