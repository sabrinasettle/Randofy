import React, { Component } from 'react';
import SpotifyContext from './context';
import axios from 'axios';
// first we will make a new context

// spotifyUser is the current signed in user
// auth is the current auth token for the spotifyUser
// playlist is an object that holds the playlist id, the current tracks of that playlist, and a link (href) to the playlist
// songIds which is just a list of the ids in playlist
const DEFAULT_STATE = {
	spotifyUser: null,
	auth: null,
	playlist: null,
	songIds: null,
	error: null,
};

const withSpotify = Component => {
	class WithSpotify extends Component {
		constructor(props) {
			super(props);
			this.State = {
				// takes the object
				...DEFAULT_STATE,
				// first one
				// spotifyUser: JSON.parse(localStorage.getItem('spotifyUser')),
			};
		}

		checkTime = async () => {
			// checks if auth is present and if a new time is greater than the time for auth
			if (this.state.auth && new Date() > this.state.auth.expires_at) {
				return await axios
					.get(`/api/token/refresh`, {
						params: { refresh_token: this.state.auth.refresh_token },
					})
					.then(response => {
						var seconds = response.data.expires_in; // change var name later

						// resets time boundaries for tokens, still add to data as it is oringnal alterations
						response.data.created_at = new Date();
						response.data.expires_at = new Date().setSeconds(
							response.data.created_at.getSeconds() + seconds,
						);

						// throw all in the localStorage
						localStorage.setItem('auth', JSON.stringify(response.data));
						this.setState({
							auth: response.data,
						});
					})
					.catch(error => {
						this.destroySession();
						this.setState({
							error: error,
						});
					});
			}
		};

		destroySession = () => {
			// clear the localStorage
			// this is done by updating the state
			// will this work?? I mean does the user even get to login in everytime or is a straight apporal of the app in the first place?
			localStorage.removeItem('spotifyUser');
			localStorage.removeItem('auth');
			localStorage.removeItem('playlist');
			this.setState({
				...DEFAULT_STATE,
			});
		};

		getUser = async () => {
			await this.checkTime();
			return await axios
				.get(`https://api.spotify.com/v1/me`, {
					headers: { Authorization: `Bearer ${this.state.auth.access_token}` },
				})
				.then(response => {
					localStorage.setItem('spotifyUser', JSON.stringify(response.data));
					this.setState(
						{
							spotifyUser: response.data,
						},
						() => {
							// refresh of the page. removing the 'code' from url
							// prettifies the url
							window.history.pushState(
								'',
								'Randofy',
								window.location.host.includes('localhost')
									? 'http://' + window.location.host
									: 'https://' + window.location.host,
							);
							// window.location.replace(window.location.host.includes('localhost') ? 'http://' + window.location.host : 'https://' + window.location.host);
						},
					);
				})
				.catch(error => {
					// if the spotify api was down
					// figure out way to show error ( pop up??? div to disable???)
					this.setState({
						error: error,
					});
				});
		};

		tokenCall = async code => {
			// gets the user https://api.spotify.com/v1/me
			// https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
			// needs the access_token and token_type in the request
			return await axios
				.get(`/api/token`, {
					params: {
						code,
					},
				})
				.then(response => {
					// console.log("token", response.data.access_token)
					// console.log("expries_in", response.data.expires_in)
					// console.log("type", response.data.token_type)

					//---------------------------
					var seconds = response.data.expires_in; // change var name later

					// create time boundaries for tokens
					// created_at, (time now)
					// expires_at, (time now + expires_in)

					response.data.created_at = new Date();
					response.data.expires_at = new Date().setSeconds(
						response.data.created_at.getSeconds() + seconds,
					);

					// throw all in the localStorage
					localStorage.setItem('auth', JSON.stringify(response.data));

					this.setState(
						{
							auth: response.data,
						},
						() => {
							// after successful auth set get current user
							this.getUser();
						},
					);
				})
				.catch(error => {
					// if backend doesnt work or code isnt valid // work on it it later
					// if code invalid, remove and alert user, url back to default
					this.setState({
						error: error,
					});
				});
		};

		getPlaylist = async playlistId => {
			await this.checkTime();
			return await axios
				.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
					headers: { Authorization: `Bearer ${this.state.auth.access_token}` },
				})
				.then(response => {
					const playlist = {
						id: response.data.id,
						tracks: response.data.tracks.items,
						link: response.data.href,
					};
					this.setState({
						playlist: playlist,
					});
					localStorage.setItem('playlist', JSON.stringify(playlist));
				})
				.catch(error => {
					this.setState({
						error: error,
					});
				});
		};

		createPlaylist = async () => {
			// add image to playlist in another function in the response
			await this.checkTime();
			return await axios
				.post(
					`https://api.spotify.com/v1/users/${this.state.spotifyUser.id}/playlists`,
					{
						name: 'Randofy',
						description:
							'Your random songs from Randofy https://randofy.vercel.app',
						public: true,
					},
					{
						headers: {
							Authorization: `Bearer ${this.state.auth.access_token}`,
						},
					},
				)
				.then(response => {
					const playlist = {
						id: response.data.id,
						tracks: response.data.tracks.items,
						link: response.data.href,
					};
					this.setState({
						playlist: playlist,
					});
					localStorage.setItem('playlist', JSON.stringify(playlist));
				})
				.catch(error => {
					this.setState({
						error: error,
					});
				});
		};

		checkForPlaylist = async () => {
			// looks for the playlist 'Randofy' in user playlists to see if its available
			await this.checkTime();
			const findPlaylist = async (offset, total) => {
				return await axios
					.get(
						`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
						{
							headers: {
								Authorization: `Bearer ${this.state.auth.access_token}`,
							},
						},
					)
					.then(response => {
						const items = response.data.items;
						if (total === -1) {
							total = response.data.total;
						}

						const filtered = items.filter(item => {
							if (item.name === 'Randofy') {
								return item.id;
							}
						});

						if (filtered.length) {
							this.getPlaylist(filtered[0].id).then(() => {
								this.getPlaylistItems();
							});
						} else if (offset + 50 >= total) {
							// creates empty/new playlist
							this.createPlaylist();
						} else {
							findPlaylist(offset + 50, total);
						}
					})
					.catch(error => {
						this.setState({
							error: error,
						});
					});
			};
			// recrussive because can only get 50 items at a time
			findPlaylist(0, -1);
		};

		addToPlaylist = async songId => {
			await this.checkTime();
			// creates playlist if there is none
			await this.checkForPlaylist();

			if (this.state.songIds && this.state.songIds.includes(songId)) {
				return 0;
			} else {
				const songUri = 'spotify:track:' + songId;
				return await axios
					.post(
						`https://api.spotify.com/v1/playlists/${this.state.playlist.id}/tracks?uris=${songUri}`,
						{},
						{
							headers: {
								Authorization: `Bearer ${this.state.auth.access_token}`,
								Accept: 'application/json',
							},
						},
					)
					.then(() => {
						let ids = this.state.songIds ? this.state.songIds : [];
						ids.push(songId);
						this.setState({
							songIds: ids,
						});
					})
					.catch(error => {
						// console.log("error in addSong")
						this.setState(
							{
								error: error,
							},
							() => {
								// console.log(this.state.error)
							},
						);
						// what happens????
					});
			}
		};

		removeFromPlaylist = async songId => {
			await this.checkTime();
			if (!this.state.songIds.includes(songId)) {
				return 0;
			} else {
				const songUri = 'spotify:track:' + songId;
				return await axios
					.delete(
						`https://api.spotify.com/v1/playlists/${this.state.playlist.id}/tracks`,
						{
							headers: {
								Authorization: `Bearer ${this.state.auth.access_token}`,
								Accept: 'application/json',
								'Content-Type': 'application/json',
							},
							data: {
								tracks: [{ uri: songUri }],
							},
						},
					)
					.then(() => {
						let ids = this.state.songIds;
						const i = ids.indexOf(songId);
						// looks for item in array, and removes it
						ids.splice(i, 1);
						this.setState({
							songIds: ids,
						});
					})
					.catch(error => {});
			}
		};

		getPlaylistItems = async () => {
			if (this.state.songIds) {
				return 1;
			}
			await this.checkTime();
			let ids = [];
			this.state.playlist.tracks.map(track => {
				return ids.push(track.track.id);
			});
			this.setState({
				songIds: ids,
			});
		};

		async componentDidMount() {
			// Check to see if the user exists then if not and have access_token then get the user

			// checks for current session
			const auth = JSON.parse(localStorage.getItem('auth'));
			const playlist = JSON.parse(localStorage.getItem('playlist'));
			const user = JSON.parse(localStorage.getItem('spotifyUser'));

			//checks and sets the state
			if (auth) {
				this.setState({
					auth: auth,
				});
			}
			if (playlist) {
				this.setState(
					{
						playlist: playlist,
					},
					() => this.getPlaylistItems(),
				);
			}
			if (user) {
				this.setState({
					spotifyUser: user,
				});
			}

			const params = new URLSearchParams(window.location.search.substring(1));
			const code = params.get('code');
			// this checks for if only existing property is code
			if (code) {
				await this.tokenCall(code).then(() => this.checkForPlaylist);
				// await this.checkForPlaylist();
			}
		}

		componentWillUnmount() {
			// May not need
			// remove listener - for protection from leaks
		}

		render() {
			return (
				<SpotifyContext.Provider
					value={{
						spotifyUser: this.state.spotifyUser,
						destroySesh: this.destroySession,
						addToPlaylist: this.addToPlaylist,
						removeFromPlaylist: this.removeFromPlaylist,
						songIds: this.state.songIds,
						error: this.state.error,
					}}>
					<Component {...this.props} />
				</SpotifyContext.Provider>
			);
		}
	}

	return WithSpotify;
};

export default withSpotify;
