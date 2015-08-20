var context = require('../utils/context.js'),
    feed = require("feed-read");

module.exports = function (req, res, next) {
    var battery = (req.params.battery) ? req.params.battery : 0;
    getNews(function(news) {
        res.render('page', context.create({
            battery: battery,
            news: news
        }));
    });
};

function getNews(cb) {
    feed("https://news.google.it/news?cf=all&hl=it&pz=1&ned=it&output=rss", function(err, articles) {
      if (err) throw err;
      cb(articles);
    });
}