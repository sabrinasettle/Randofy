import getRandomSearch from "../../lib/js/helpers/randomLib.mjs";
import { spotifyApi } from "../../lib/js/spotify-api/SpotifyClient.mjs";

const getData = (req, max, callback) => {
  let search = getRandomSearch();
  console.log(req, max);
  let att = 0;
  let index = 1;
  let retArray = [];
  // doit tracks attempts, by count
  function doit() {
    att++;
    // console.log("attempt number: ", att, search );
    if (att % 50 === 0) {
      search = getRandomSearch();
    }
    retry();
  }
  // retry makes the attempt to get data

  // new regex(/^:+[a-zA-Z]*:)
  function retry() {
    let randomOffset = Math.floor(Math.random() * 10);
    spotifyApi
      .searchTracks(search, { limit: 1, offset: randomOffset, method: "GET" })
      .then(
        async function (data) {
          const tracks = (await data.json()).tracks;
          if (!tracks || tracks.total === 0) {
            return doit();
          }
          // get ip from vercel headers
          const country = req.headers["x-vercel-ip-country"];
          const item = tracks.items[0];
          if (
            (country &&
              item &&
              item.album.available_markets.includes(country)) ||
            (process.env.NODE_ENV === "development" && item)
          ) {
            // console.log(item.id);
            let returnData = {
              album_name: item.album.name,
              album_image: item.album.images[1],
              track_artist: item.artists[0].name,
              track_name: item.name,
              preview_url: item.preview_url,
              spotify_url: item.external_urls.spotify,
              is_explicit: item.explicit,
              track_id: item.id,
              attempts: att,
            };
            if (max === 1) {
              callback(returnData);
            } else {
              retArray.push(returnData);
              if (index >= max) {
                callback(retArray);
              } else {
                index++;
                search = getRandomSearch();
                att = 0;
                retry();
              }
            }
          } else {
            console.log("bad Market Match");
            doit();
          }
        },
        function (err) {
          doit();
        },
      );
  }
  doit();
};
export const config = {
  api: {
    externalResolver: true,
  },
};

/* GET random song object https://.../random */
export default function GET(req, res) {
  console.log(req);
  console.log(req.params);
  if (!spotifyApi) {
    // throw new Error("No Spotify API");
    return res.status(500).send("No Spotify API");
  }
  getData(req, req.body.max || 1, (returnData) => {
    res.status(200).send(returnData);
  });
}
