const imageToBase64 = require('image-to-base64');
var express = require('express');
var router = express.Router();

function getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    
    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
  
    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + '%';
        break;
      case 1:
        randomSearch = '%' + randomCharacter + '%';
        break;
    }
  
    return randomSearch;
  }

/* GET home page. */
router.get('/', function(req, res, next) {
    const search = getRandomSearch();
    console.log(search)
    let att = 0;
    function doit() {
      att++;
        console.log("attempt number: ", att );
        retry();
    }
    function retry() {
        let randomOffset = Math.floor(Math.random() * 10000);
            req.spotify.searchTracks(search,{ limit: 1, offset: randomOffset})
            .then( function(data) {
            
            let returnData = {
            "album_name": data.body.tracks.items[0].album.name,
            "album_image": data.body.tracks.items[0].album.images[2],
            "track_artist": data.body.tracks.items[0].artists[0].name,
            "track_name": data.body.tracks.items[0].name,
            "preview_url": data.body.tracks.items[0].preview_url,
            "spotify_url": data.body.tracks.items[0].external_urls.spotify,
            "is_explicit": data.body.tracks.items[0].explicit,
            "attempts": att,
            };
            if (returnData.preview_url){
                console.log(returnData.preview_url)
            }
            imageToBase64(returnData.album_image.url) // Image URL
            .then((response) => {
                const svg = `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%">
                <a href='${returnData.spotify_url}'>
                    <text overflow-wrap='normal' y='20'>
                    Album: '${returnData.album_name.replace('&', 'and')}' 
                    </text >
                    <text overflow-wrap='normal' y='35' >
                    Song:  '${returnData.track_name.replace('&', 'and')}'
                    </text >
                    <text overflow-wrap='normal' y='120' >
                    Explicit?  ${returnData.is_explicit ? 'true' : 'false'}
                    </text >
                    <image y="40" href='data:image/jpeg;base64,${response}'  height="${returnData.album_image.height}" width="${returnData.album_image.width}"/>
                </a>
                <a href='${returnData.spotify_url}'>
                    <text overflow-wrap='normal' y='140'>
                    Click me to listen on Spotify
                    </text >
                </a>
                </svg>`;
                res.set('Content-Type', 'image/svg+xml');
                res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
                res.send(svg);
                }
            )
            .catch(
                (error) => {
                    console.log(error); // Logs an error if there was one
                }
            )
            }, function(err) {
                console.log("nope")
                doit();
        })};
    doit();
});

module.exports = router;
