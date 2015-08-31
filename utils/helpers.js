var hbs = require('hbs'),
    fs = require('fs'),
    apps = require('./apps.js');

// Get link for a given URI (remove the starting /)
exports.link = function (uri) {
    return uri.substring(1);
};

exports.resource = function(app, name) {
    return '/appsStatic/'+app+'/resources/'+name;
}

exports.userApps = function(args) {
    var data = args.data.root,
        layout = fs.readFileSync(__dirname+'/../views/layouts/'+data.user.layout+'.hbs', 'utf8'),
        layoutTpl = hbs.compile(layout),
        appLayouts = [],
        views = data.user.apps.map(function(app, index) {
            var layout = apps.getAppLayoutByPos(index, data.user.layout);
            appLayouts.push('layout_'+layout);
            return apps.getAppView(app, layout);
        });
    // Filling the layout with apps views
    var viewsTpl = layoutTpl({
        appViews: views, 
        appLayouts: appLayouts
    });

    return hbs.compile(viewsTpl)(data);
}

exports.appHead = function(app, args) {
    var layout = apps.getAppView(app, 'head', true),
        tpl = hbs.compile(layout);
    return tpl(args.data.root);
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

exports.temperature = function(temp) {
    return Math.round(temp);
}