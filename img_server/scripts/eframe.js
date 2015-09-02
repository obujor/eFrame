var page = require('webpage').create(),
    system = require('system'),
    batPerc = 0;

if (system.args.length > 1) {
    batPerc = parseInt(Array.prototype.slice.call(system.args, 1));
}

page.settings.viewportSize = { width: 800, height: 600 };
page.open('http://eframe.tavy.org:9006/test1/'+batPerc, function(status) {
        if (status !== 'success') {
            console.log('Error: Unable to access network!');
        } else {
            page.clipRect = { left: 0, top: 0, width: 800, height: 600 };
            page.render('image.png');
        }
      
      phantom.exit();
});

