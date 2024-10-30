import { NextResponse } from "next/server";
import getRandomSearch from "../../../lib/js/helpers/randomLib.mjs";
import { spotifyApi } from "../../../lib/js/spotify-api/SpotifyClient.mjs";
// import { getColor } from "color-thief-react";
import { getColor } from "colorthief";

const getData = async (req, max) => {
  let search = getRandomSearch();

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("filters");

  const filters = JSON.parse(query);

  let numberOfSongs = filters.numberOfSongs;
  // console.log(numberOfSongs);
  // console.log(search, filters);

  // let max = 1;
  let att = 0;
  let index = 1;
  let retArray = [];
  let retData;
  // doit tracks attempts, by count
  async function doit() {
    att++;
    // console.log("attempt number: ", att, search );
    if (att % 50 === 0) {
      search = getRandomSearch();
    }
    return await retry();
  }

  // retry makes the attempt to get data
  //
  async function getGenres(artists) {
    let genres = [];
    // console.log(artists);
    artists.map(async (artist) => {
      const request = await spotifyApi.getArtist(artist.id);
      const artistData = await request.json();
      // console.log(artistData);
      genres = artistData.genres;
    });
    return genres;
  }

  async function getBkgrdColor(image) {
    // console.log("get color", image);
    const response = await fetch(image.url);
    const buf = await response.arrayBuffer();

    const dominantColor = await getColor(buf);

    console.log(dominantColor);
    function rgbToHex(rgbArray) {
      return (
        "#" +
        rgbArray
          .map((value) => {
            let hex = value.toString(16);
            return hex.length === 1 ? "0" + hex : hex; // Ensure 2-digit hex values
          })
          .join("")
      );
    }
    console.log(rgbToHex(dominantColor));
    // return dominantColor;
    return rgbToHex(dominantColor);
  }

  // new regex(/^:+[a-zA-Z]*:)
  async function retry() {
    let randomOffset = Math.floor(Math.random() * 10);
    // add Market to the query
    const reccomendations = await spotifyApi.getReccomendations(
      search,
      filters,
    );
    const data = await reccomendations.json();
    console.log("retry", data);
    const tracks = data.tracks;

    let recommendedTracks = [];

    for (const item of tracks) {
      let genres = await getGenres(item.artists);
      let color = await getBkgrdColor(item.album.images[0]);
      //url was an object

      recommendedTracks.push({
        track_name: item.name,
        track_artists: item.artists,
        is_explicit: item.explicit,
        album_name: item.album?.name,
        album_image: item.album.images[0],
        track_id: item.id,
        //could be null
        preview_url: item.preview_url,
        release_year: item.album?.release_date,
        genres: [],
        song_length: item.duration_ms,
        genres: genres,
        color: color,
      });
    }
    // console.log("text aaaaaaaaaaaaa", recommendedTracks);
    let returnData = {
      recommendedTracks,
    };
    retData = returnData;
    return returnData;

    // spotifyApi.getReccomendations(search, filters).then(
    //   async function (request) {
    //     const data = await request.json();
    //     // console.log(data);
    //     const tracks = data.tracks;
    //     // remove
    //     // const item = tracks.items[0] || [];
    //     console.log(tracks);
    //     // if (!tracks || tracks.total === 0) {
    //     //   return doit();
    //     // }
    //     // } else {
    //     //   let ids = [];
    //     //   tracks.items.map((song) => {
    //     //     ids.push(song.id);
    //     //   });
    //     //   // console.log("test ids", ids);
    //     //   const audioFeaturesRequest = spotifyApi.getTracksAudioFeatures(ids);
    //     //   const audioFeaturesData = await audioFeaturesRequest.json();
    //     //   const audioFeatures = audioFeaturesData.audio_features || {};
    //     //   console.log(audioFeatures);
    //     // }
    //     // get ip from vercel headers
    //     const country = req.headers["x-vercel-ip-country"];
    //     if (
    //       (country && item && item.album.available_markets.includes(country)) ||
    //       process.env.NODE_ENV === "development"
    //     ) {
    //       // console.log(item.id);
    //       // add duration, genres
    //       //
    //       let recommendedTracks = [];
    //       tracks.map((item) => {
    //         recommendedTracks.push({
    //           track_name: item.name,
    //           is_explicit: item.explicit,
    //           album_name: item.album?.name,
    //           album_image: item.album.images[1],
    //           track_id: item.id,
    //           //could be null
    //           preview_url: item.preview_url,
    //         });
    //       });

    //       let returnData = {
    //         //   album_name: item.album?.name,
    //         //   album_image: item.album.images[1],
    //         //   track_artist: item.artists[0].name,
    //         //   track_name: item.name,
    //         //   preview_url: item.preview_url,
    //         //   spotify_url: item.external_urls.spotify,
    //         //   is_explicit: item.explicit,
    //         //   track_id: item.id,
    //         //   attempts: att,
    //         recommendedTracks,
    //       };
    //       // max is the maxium amount of requests
    //       if (max === 1) {
    //         retData = returnData;
    //         // callback(returnData);
    //       } else {
    //         retArray.push(returnData);
    //         if (index >= max) {
    //           retData = returnData;
    //           // callback(retArray);
    //         } else {
    //           index++;
    //           search = getRandomSearch();
    //           att = 0;
    //           retry();
    //         }
    //       }
    //     } else {
    //       console.log("bad Market Match");
    //       doit();
    //     }
    //   },
    //   function (err) {
    //     doit();
    //   },
    // );
  }
  if (!retData) {
    return await doit();
  } else {
    return retData;
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
};

/* GET random song object https://.../random */
export async function GET(req) {
  // console.log("test", query);

  // return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })

  if (!spotifyApi) {
    // return Response.json(returnData);
    // return response.status(500).send("No API");
    // return res.status(500).send("No Spotify API");
    return NextResponse.json({ error: "No Spotify API" }, { status: 500 });
  }
  //do we need max?
  const data = await getData(req, req.body?.max || 1);
  console.log("data in spotify get", data);

  return NextResponse.json(data);

  // return NextResponse.json({ success: true });
}
