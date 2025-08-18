import { NextResponse } from "next/server";
import getRandomSearch from "../../../lib/js/helpers/randomLib.mjs";
import { spotifyApi } from "../../../lib/js/spotify-api/SpotifyClient.mjs";
import getColor from "colorthief";

const getData = async (req, max) => {
  let search = getRandomSearch();

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.toString();

  // const filters = JSON.parse(query);
  // console.log("Get Data \n\n\n\n\nSearch: ", search, "\n\nQuery: ", query);

  // let max = 1;
  let att = 0;
  let index = 1;
  let retArray = [];
  let retData;
  // doit tracks attempts, by count
  async function doit() {
    //attempts
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
    await Promise.all(
      artists.map(async (artist) => {
        const request = await spotifyApi.getArtist(artist.id);
        const artistData = await request.json();
        artistData.genres.forEach((genre) => {
          genres.push(genre);
        });
      }),
    );
    return genres;
  }

  async function getBkgrdColor(image) {
    // console.log("get color", image);
    const response = await fetch(image.url);
    const buf = await response.arrayBuffer();

    const dominantColor = await getColor(buf);

    // console.log(dominantColor);
    // error here
    function rgbToHex(rgbArray) {
      if (!rgbArray) return "#000000";
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
    // console.log(rgbToHex(dominantColor));
    // return dominantColor;
    return rgbToHex(dominantColor);
  }

  //array of ids
  async function getAudioFeatures(ids) {
    // console.log("get audio features", ids);
    const response = await spotifyApi.getTracksAudioFeatures(ids);
    const audioFeatures = await response.json(); // assuming `.json()` is needed
    return audioFeatures;
  }

  // new regex(/^:+[a-zA-Z]*:)
  async function retry() {
    let randomOffset = Math.floor(Math.random() * 10);
    // add Market to the query
    const reccomendations = await spotifyApi.getRecommendations(search, query);
    const data = await reccomendations.json();
    if (!data || !data.tracks) {
      throw new Error("Spotify API returned no tracks");
    }
    // console.log("retry", data);
    const tracks = data.tracks;

    let recommendedTracks = [];
    const ids = tracks.map((item) => item.id);
    let { audio_features: tracksAudiofeatures } = await getAudioFeatures(ids);

    for (const item of tracks) {
      let genres = await getGenres(item.artists);
      let color = await getBkgrdColor(item.album.images[0]);
      let trackAudiofeatures = tracksAudiofeatures.find(
        (feature) => feature.id === item.id,
      );

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
        song_length: item.duration_ms,
        genres: genres,
        color: color,
        generated_at: new Date(),
        is_playable: item.is_playable,
        href: `https://open.spotify.com/track/${item.id}`,
        popularity: item.popularity,

        audioFeatures: {
          acousticness: trackAudiofeatures.acousticness,
          danceability: trackAudiofeatures.danceability,
          energy: trackAudiofeatures.energy,
          instrumentalness: trackAudiofeatures.instrumentalness,
          liveness: trackAudiofeatures.liveness,
          loudness: trackAudiofeatures.loudness,
          speechiness: trackAudiofeatures.speechiness,
          tempo: trackAudiofeatures.tempo,
          valence: trackAudiofeatures.valence,
          // mode: trackAudiofeatures.mode,
          // key: trackAudiofeatures.key,
          // time_signature: trackAudiofeatures.time_signature
        },
      });
    }
    let returnData = {
      recommendedTracks,
    };
    retData = returnData;
    return returnData;
  }
  if (!retData) {
    return await doit();
  } else {
    return retData;
  }
};
/* GET random song object https://.../random */
export async function GET(req) {
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
