var context = require('../utils/context.js'),
    feed = require("feed-read");

module.exports = function (req, res, next) {
    var battery = (req.params.battery) ? req.params.battery : 0;
    var topic = (req.params.topic);
    getNews(function(news) {
        res.render('page', context.create({
            battery: battery,
            news: news
        }));
    }, topic);
};

function getNews(cb,tp) {
    feed("https://news.google.it/news?cf=all&hl=it&pz=1&topic="+tp+"&ned=it&output=rss", function(err, articles) {
      if (err) throw err;
      cb(articles);
    });
}
