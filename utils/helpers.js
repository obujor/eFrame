var hbs = require('hbs'),
    fs = require('fs'),
    apps = require('./apps.js'),
    dateFormat = require('dateformat');

// Get link for a given URI (remove the starting /)
exports.link = function (uri) {
    return uri.substring(1);
};

exports.resource = function(app, name) {
    return '/appsStatic/'+app+'/resources/'+name;
}

exports.userApps = function(args) {
    var data = args.data.root,
        layoutConfig = getLayoutConfig(data.user) || { // Default layout
            layout: 'cells',
            apps: apps.getAppsList()
        },
        layout = fs.readFileSync(__dirname+'/../views/layouts/'+layoutConfig.layout+'.hbs', 'utf8'),
        layoutTpl = hbs.compile(layout),
        appLayouts = [],
        views = layoutConfig.apps.map(function(app, index) {
            var layout = apps.getAppLayoutByPos(index, layoutConfig.layout);
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

exports.dateNow = function() {
    var now = new Date();
    return dateFormat(now, "dd/mm/yyyy");
}

exports.timeNow = function() {
    var now = new Date();
    return dateFormat(now, "HH:MM");
}

function getLayoutConfig(userData) {
    var layouts = userData.layouts && findLayoutsByHour(userData.layouts);
    if ( layouts && layouts.length ) {
        return getTheNearestLayout(layouts);
    }
    return null;
}

function findLayoutsByHour(layouts) {
    var hour = new Date().getHours();
    layouts = Object.keys(layouts).map(function (key) {
                return layouts[key];
            });

    var filterLayouts = function() {
        return layouts.filter(function(obj) {
            return filterHours(obj.hours, hour).length != 0;
        });
    };

    var found = filterLayouts();
    while(!found.length && --hour)
        found = filterLayouts();
    hour = 24;
    while(!found.length && --hour)
        found = filterLayouts();

    return found;
}

function filterHours(hours, hour) {
    return hours.filter(function(h) {
        return h.from <= hour && hour < h.to;
    });
}

function getTheNearestLayout(layouts) {
    var hour = new Date().getHours();
    layouts.sort(function(a, b) {
        var getDiff = function(h) {
            return Math.min(Math.abs(h[0].from-hour), Math.abs(h[0].to-hour));
        };

        var diffa = getDiff(filterHours(a.hours, hour));
        var diffb = getDiff(filterHours(b.hours, hour));

        if ( diffa < diffb ) return -1;
        if ( diffa > diffb ) return 1;
        if ( a.hours.length < b.hours.length ) return -1;
        if ( a.hours.length > b.hours.length ) return 1;
        return 0;
    });
    return layouts[0];
}