var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'G039yDEavRksd7HbxLwznzNJf',
    consumer_secret: 'AIZ6Uy0oCZ9cefzCAPHs7jGjbGw0uWw7aU7MTr47JpdYaZRIxN',
    access_token_key: '3513906327-WKjb64pjFzKrtNkGqY8bvOmFSyRTT0zHtVhZyaO',
    access_token_secret: 'EpHDE0PWUw6x3AtySFsj5PbZbRhdnWLgAvlijnIIQlDfp'
});

exports.getData = function (user, device, cb) {
    getHomeTimeline(cb);
};

function getHomeTimeline(cb) {
   var params = {
        count: 5,
	exclude_replies: true
    };
    client.get('statuses/home_timeline', params, function(error, tweets, response) {
      if (!error) {
        var data = tweets.map(getDataFromStatus);
        cb(data);
      } else {
        cb({});
      }
    }); 
}

function getTwits(cb) {
    var params = {
        q: 'node.js',
        result_type: 'popular',
        /*lang: 'it',*/
        count: 5
    };
    client.get('search/tweets', params, function(error, tweets, response) {
      if (!error) {
        var data = tweets.statuses.map(getDataFromStatus);
        cb(data);
      } else {
        cb({});
      }
    });
}

function getDataFromStatus(status) {
    return {
        text: status.text,
        author: status.user.screen_name,
        authorImg: status.user.profile_image_url
    };
}
