var feed = require("feed-read");

exports.getData = function (user, device, cb) {
    var topic = user.news && user.news.topic;
    getNews(topic, cb);
};

function getNews(tp, cb) {
    tp = (tp) ? '&topic='+tp : '';
    feed('https://news.google.it/news?cf=all&hl=it&pz=1'+tp+'&ned=it&output=rss', function(err, articles) {
      if (err) throw err;
      cb(articles);
    });
}