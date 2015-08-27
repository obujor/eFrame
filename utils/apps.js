var path = require('path'),
    fs = require('fs');
var apps = require('../config.json').apps;
var appsFolder = '../apps/';

exports.load = function (hbs) {
    apps.forEach(function(appName) {
        hbs.registerPartials(getAppViewsFolder(appName));
    });
};

exports.getData = function(initData, cb) {
    var appsNr = apps.length,
        appsData = {
            apps: apps.map(getAppInfo)
        };

    var callCallback = function() {
        if (!--appsNr) cb(appsData);
    };

    apps.forEach(function(appName) {
        var controller = getAppController(appName);
        controller.getData(initData.user, initData.device, function(data) {
            if ( appsData[appName] ) {
                console.error('The config name "'+appName+'" is already used!');
            } else {
                appsData[appName] = data;
            }
            callCallback();
        });
    });
};

exports.getAppView = function(app, layout) {
    var getViewPath = function(layout) {
        return getAppViewsFolder(app)+'/'+app+'_'+layout+'.hbs';
    }
    var viewPath = getViewPath(layout);

    if (fs.existsSync(viewPath)) {
        return fs.readFileSync(viewPath, 'utf8');
    } else {
        return fs.readFileSync(getViewPath('full'), 'utf8');
    }
};

exports.getAppLayoutByPos = function(index, layout) {
    switch(layout) {
        case "bbottomtop":
            return (!index) ? "horizontal" : "cell";
        case "ttopbottom":
            return (index == 2) ? "horizontal" : "cell";
        case "lleftright":
            return (index == 2) ? "vertical" : "cell";
        case "rrightleft":
            return (!index) ? "vertical" : "cell";
        case "topbottom":
            return "horizontal";
        case "leftright":
            return "vertical";
        default:
            return layout;
    }
};

function getAppInfo(name) {
    return {
        name: name,
        hasStyle: fs.existsSync(__dirname+'/'+appsFolder+name+'/resources/style.less')
    }
}

function getAppController(name) {
    return require(appsFolder+name+'/'+name+'-controller.js');
}

function getAppViewsFolder(name) {
    return path.resolve(__dirname+'/'+appsFolder+name+'/views');
}