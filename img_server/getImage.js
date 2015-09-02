var exec = require('child_process').exec;
var fs = require('fs');


var get = function(battperc, format, callback) {
	exec('phantomjs scripts/eframe.js '+battperc, function(error, stdout, stderr) {
		var fileName = 'data/img_'+new Date().toISOString()+'.png';
		exec('convert image.png -scale 800x600! -rotate 90 '+fileName, function(error, stdout, stderr) {
			if (format == 'png') {
				callback(fileName);
			} else if ( format == 'json') {
				exec('ffmpeg -i '+fileName+' -vf transpose=2 -f rawvideo -pix_fmt rgb565 -s 800x600 -y img.raw', function() {
					exec('gzip -9 -f img.raw', function() {
						var result = {
							sleepSec: getSleepSec(),
							img: new Buffer(fs.readFileSync('img.raw.gz')).toString('base64')
						}
						callback(result);
					});
				});
			}

		});
	});
};

function getSleepSec() {
	var sleep = JSON.parse(fs.readFileSync('./config.json', 'utf8')).sleep;
	return sleep;
}

exports.get = get;
