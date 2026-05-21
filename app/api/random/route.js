import { NextResponse } from "next/server";
import getRandomSearch from "../../../lib/js/helpers/randomLib.mjs";
import { spotifyApi } from "../../../lib/js/spotify-api/SpotifyClient.mjs";
import { redis } from "../../../lib/redis";

const COUNTER_KEY = "items_returned_total";
const ARTIST_LOOKUP_BATCH_SIZE = 50;

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

const getData = async (req, max) => {
  let search = getRandomSearch();

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.toString();
  const timings = {};
  const startedAt = Date.now();

  async function timed(label, work) {
    const start = Date.now();
    try {
      return await work();
    } finally {
      timings[label] = Date.now() - start;
    }
  }

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
  async function getArtistGenresById(tracks) {
    const artistIds = [
      ...new Set(
        tracks.flatMap((track) =>
          track.artists.map((artist) => artist.id).filter(Boolean),
        ),
      ),
    ];

    const artistChunks = chunkArray(artistIds, ARTIST_LOOKUP_BATCH_SIZE);
    const artistResponses = await Promise.all(
      artistChunks.map(async (ids) => {
        const response = await spotifyApi.getArtists(ids);
        if (!response.ok) {
          throw new Error(`Spotify artist lookup failed: ${response.status}`);
        }
        const data = await response.json();
        return data.artists || [];
      }),
    );

    return new Map(
      artistResponses
        .flat()
        .filter(Boolean)
        .map((artist) => [artist.id, artist.genres || []]),
    );
  }

  //array of ids
  async function getAudioFeatures(ids) {
    // console.log("get audio features", ids);
    const response = await spotifyApi.getTracksAudioFeatures(ids);
    const audioFeatures = await response.json(); // assuming `.json()` is needed
    return audioFeatures;
  }

  async function incrementCount(count) {
    await redis.incrBy(COUNTER_KEY, count);
  }

  // new regex(/^:+[a-zA-Z]*:)
  async function retry() {
    // add Market to the query
    const data = await timed("recommendations_ms", async () => {
      const reccomendations = await spotifyApi.getRecommendations(search, query);
      return await reccomendations.json();
    });
    if (!data || !data.tracks) {
      throw new Error("Spotify API returned no tracks");
    }
    // console.log("retry", data);
    const tracks = data.tracks;

    const count = tracks.length; // e.g. 5–100
    await timed("counter_ms", () => incrementCount(count));

    const ids = tracks.map((item) => item.id);
    const { audio_features: tracksAudiofeatures = [] } = await timed(
      "audio_features_ms",
      () => getAudioFeatures(ids),
    );
    const audioFeaturesById = new Map(
      tracksAudiofeatures.filter(Boolean).map((feature) => [feature.id, feature]),
    );
    const artistGenresById = await timed("artist_genres_ms", () =>
      getArtistGenresById(tracks),
    );

    const recommendedTracks = tracks.map((item) => {
      const genres = [
        ...new Set(
          item.artists.flatMap(
            (artist) => artistGenresById.get(artist.id) || [],
          ),
        ),
      ];
      const trackAudiofeatures = audioFeaturesById.get(item.id) || {};

      return {
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
      };
    });
    let returnData = {
      recommendedTracks,
    };
    console.info("[api/random] timings", {
      count,
      total_ms: Date.now() - startedAt,
      ...timings,
    });
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
  console.info("[api/random] returned tracks", data.recommendedTracks.length);

  return NextResponse.json(data);

  // return NextResponse.json({ success: true });
}
