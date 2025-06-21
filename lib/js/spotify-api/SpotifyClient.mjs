import { GlobalRef } from "../../../lib/js/helpers/GlobalRef.js";
class SpotifyClient {
  client_id = "";
  client_secret = "";
  access_token = "";
  expires_at = "";
  BASE_URL = "https://api.spotify.com/v1";

  constructor(client_id, client_secret) {
    if (!client_id || !client_secret)
      throw new Error("Missing required params, client_id and client_secret");
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.grantClientCredentials();
  }

  async resetToken() {
    if (new Date().getTime() >= this.expires_at) {
      await this.grantClientCredentials();
    }
  }

  async grantClientCredentials() {
    const BASE_URL = "https://accounts.spotify.com/api/token";

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${this.client_id}&client_secret=${this.client_secret}`,
    });
    const body = await res.json();
    this.access_token = body.access_token;
    const hours = body.expires_in / 3600;
    this.expires_at = new Date().setHours(new Date().getHours() + hours);
    console.log("Access token: ", this.access_token);

    console.log("Currnet time: ", new Date().getTime());
    console.log("Expires at: ", this.expires_at);
  }

  /**
   * @param {*} url - the url to send the request to not including the base url
   * @param {*} options - { method: "GET", headers: { }, body: { } }
   * @returns
   */
  async createSpotifyRequest(url, options) {
    await this.resetToken();
    const res = await fetch(`${this.BASE_URL}/${url}`, {
      ...options,
      headers: {
        ...(options ? options.headers : {}),
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    return res;
  }

  async searchTracks(query, options) {
    console.log("options at search tracks: ", options);
    return this.createSpotifyRequest(
      `search?q=${encodeURIComponent(query)}&type=track&limit=${options.limit || 5}&offset=${options.offset || 0}&market=${options.market || "US"}`,
      options,
    );
  }

  async getArtist(query, options) {
    return this.createSpotifyRequest(`artists/${query}`, options);
  }

  //Get Several Tracks' Audio Features
  //array of ids
  //query is the array
  async getTracksAudioFeatures(ids) {
    return this.createSpotifyRequest(`audio-features?ids=${ids}`);
  }

  genres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music",
  ];
  // let defaultFilters = {
  //   numberOfSongs: 5,
  //   popularity: [0, 100],
  //   acousticness: [0.0, 1.0], //float range from 0.0 to 1.0
  //   danceability: [0.0, 1.0], //float range from 0.0 to 1.0
  //   energy: [0.0, 1.0], //float range from 0.0 to 1.0
  //   tempo: [0.0, 1.0], //float range from 0.0 to 1.0
  //   valence: [0.0, 1.0], //float range from 0.0 to 1.0
  //   speechiness: [0.0, 1.0], //float range from 0.0 to 1.0
  // };
  async getReccomendations(query, options) {
    const params = new URLSearchParams();

    if (!options.includes("genres=")) {
      //TODO: update genres to be random between 0 and this.genres.length
      const genereString = `${this.genres[10]},${this.genres[1]},${this.genres[2]},${this.genres[20]}`;
      params.set("seed_genres", genereString);
    }
    console.log(`recommendations?` + options + params.toString());
    return this.createSpotifyRequest(
      `recommendations?` + options + "&" + params.toString(),
      {
        headers: { method: "GET" },
      },
    );
  }
}

const spotify = new GlobalRef("spotifyClient");

const setGlobalVar = () => {
  const client_id = process.env["SPOT_ID"];
  const client_secret = process.env["SPOT_SECRET"];
  if (!spotify.value) {
    return new SpotifyClient(client_id, client_secret);
  }
};
if (!spotify.value) {
  spotify.value = setGlobalVar();
}
export const spotifyApi = spotify.value;

export default SpotifyClient;
