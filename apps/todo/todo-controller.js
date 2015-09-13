exports.getData = function (user, device, cb) {
    var data = user.todo;
    var tasks = [];
    Object.keys(data).forEach(function(key) {
        var parts = key.split('_');
        if (tasks[parts[1]]) {
            tasks[parts[1]][parts[0]] = data[key];
        } else {
            var obj = {};
            obj[parts[0]] = data[key];

            tasks.push(obj);
        }
    });
    cb(tasks);
};