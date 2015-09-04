var path = require('path'),
    fs = require('fs');
var appsFolder = '../apps/';

exports.load = function (hbs) {
    var apps = getAppsList();
    apps.forEach(function(appName) {
        hbs.registerPartials(getAppViewsFolder(appName));
    });
};

exports.getData = function(initData, cb) {
    var apps = getAppsList(),
        appsNr = apps.length,
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

exports.getAppView = function(app, layout, noDefault) {
    var getViewPath = function(layout) {
        return getAppViewsFolder(app)+'/'+app+'_'+layout+'.hbs';
    }
    var viewPath = getViewPath(layout);

    if (fs.existsSync(viewPath))
        return fs.readFileSync(viewPath, 'utf8');
    else if(!noDefault)
        return fs.readFileSync(getViewPath('full'), 'utf8');
    else 
        return "";
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

function getAppsList() {
    var dir = path.resolve(__dirname+'/'+appsFolder);
    return fs.readdirSync(dir).filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function getAppInfo(name) {
    var appFolder = __dirname+'/'+appsFolder+name+'/';
    return {
        name: name,
        hasStyle: fs.existsSync(appFolder+'resources/style.less')
    }
}

function getAppController(name) {
    return require(appsFolder+name+'/'+name+'-controller.js');
}

function getAppViewsFolder(name) {
    return path.resolve(__dirname+'/'+appsFolder+name+'/views');
}