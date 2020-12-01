var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.spotify.searchTracks('artist:Love')
    .then(function(data) {
        console.log('Search tracks by "Love" in the artist name', data.body);
        res.send(data.body, 200);
        }, function(err) {
        console.log('Something went wrong!', err);
    });
});

module.exports = router;

