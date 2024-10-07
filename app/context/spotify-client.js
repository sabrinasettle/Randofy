'use client';
import React from 'react';

const DEFAULT_STATE = {
	spotifyUser: null,
	auth: null,
	playlist: null,
	songIds: null,
	error: null,
};

export const SpotifyClient = async () => {
	const [spotifyUser, setSpotifyUser] = React.useState(null);
	const [auth, setAuth] = React.useState(null);
	const [playlist, setPlaylist] = React.useState(null);
	const [songIds, setSongIds] = React.useState(null);
	const [error, setError] = React.useState(null);

	React.useEffect(async () => {
		const auth = JSON.parse(localStorage.getItem('auth'));
		const spotifyUser = JSON.parse(localStorage.getItem('spotifyUser'));
		const playlist = JSON.parse(localStorage.getItem('playlist'));
		if (auth) {
			setAuth(auth);
		}
		if (spotifyUser) {
			setSpotifyUser(spotifyUser);
		}
		if (playlist) {
			setPlaylist(playlist);
		}

		const params = new URLSearchParams(window.location.search.substring(1));
		const code = params.get('code');
		if (code) {
			await tokenCall(code);
			await checkForPlaylist();
		}
	}, []);

	const destroySession = () => {
		// clear the localStorage
		// this is done by updating the state
		// will this work?? I mean does the user even get to login in everytime or is a straight apporal of the app in the first place?
		localStorage.removeItem('spotifyUser');
		localStorage.removeItem('auth');
		localStorage.removeItem('playlist');
		setSpotifyUser(null);
		setAuth(null);
		setPlaylist(null);
		setSongIds(null);
		setError(null);
	};

	const checkTokenTime = async () => {
		// checks if auth is present and if a new time is greater than the time for auth
		if (auth && auth.expires_at && new Date() > auth.expires_at) {
			const params = new URLSearchParams({
				refresh_token: auth.refresh_token,
			});
			const res = await fetch('api/token/refresh? ' + params.toString());

			if (res.status === 200) {
				const data = await res.json();
				const seconds = data.expires_in;
				data.created_at = new Date();
				data.expires_at = new Date().setSeconds(
					data.created_at.getSeconds() + seconds,
				);
				localStorage.setItem('auth', JSON.stringify(data));
				setAuth(data);
			} else {
				setError(res);
			}
		}
	};

	const getSpotifyUser = async () => {
		const res = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${auth.access_token}`,
			},
		});
		const data = await res.json();
		setSpotifyUser(data);
		localStorage.setItem('spotifyUser', JSON.stringify(data));
		window.history.pushState(
			'',
			'',
			window.location.host.includes('localhost')
				? 'http://' + window.location.host
				: 'https://' + window.location.host,
		);
	};

	const getPlaylist = async playlistId => {
		await checkTokenTime();
		const temp = await fetch(
			`https://api.spotify.com/v1/playlists/${playlistId}`,
			{
				headers: { Authorization: `Bearer ${auth.access_token}` },
			},
		);
		const response = await temp.json();

		const playlist = {
			id: response.id,
			tracks: response.tracks.items,
			link: response.href,
		};
		setPlaylist(playlist);
		localStorage.setItem('playlist', JSON.stringify(playlist));
	};

	const tokenCall = async code => {
		// gets the user https://api.spotify.com/v1/me
		// https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
		// needs the access_token and token_type in the request
		const res = await fetch('/api/token', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			params: {
				code,
			},
		});
		const data = await res.json();
		const seconds = data.expires_in;
		data.created_at = new Date();
		data.expires_at = new Date().setSeconds(
			data.created_at.getSeconds() + seconds,
		);
		localStorage.setItem('auth', JSON.stringify(data));
		setAuth(data);
		getSpotifyUser();
		// needs error handling;
	};

	const findPlaylist = async (offset, total) => {
		const res = await fetch(
			`https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${auth.access_token}`,
				},
			},
		);

		//Testing this for non 200 status... new on 10/7/24
		if (res.status !== 200) {
			setError(res.json());
		}
		const data = await res.json();
		const items = data.items;
		if (total === -1) {
			total = data.total;
		}
		const filtered = items.filter(item => {
			if (item.name === 'Randofy') {
				return item.id;
			}
		});

		if (filtered.length) {
			await getPlaylist(filtered[0].id);
			await getPlaylistItems();
		} else if (offset + 50 >= total) {
			await createPlaylist();
		} else {
			findPlayList(offset + 50, total);
		}
	};

	const checkForPlaylist = async () => {
		// looks for the playlist 'Randofy' in user playlists to see if its available
		await checkTokenTime();
		// recursive because can only get 50 items at a time
		await findPlaylist(0, -1);
	};

	const createPlaylist = async () => {
		// check token status first, always.
		// (this is probably not needed but i did it always previously);
		await checkTokenTime();
		const res = await fetch(
			`https://api.spotify.com/v1/users/${spotifyUser.id}/playlists`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${auth.access_token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: 'Randofy',
					description:
						'A playlist created by Randofy of your saved songs. Enjoy!',
					public: true,
				}),
			},
		);

		//Testing this for non 200 status... new on 10/7/24
		if (!res.ok) {
			setError(res.json());
		} else {
			const data = await res.json();
			const playlist = {
				id: data.id,
				tracks: data?.tracks?.items || [],
				link: data.href,
			};
			setPlaylist(playlist);
			localStorage.setItem('playlist', JSON.stringify(playlist));
		}
	};

	const context = { getPlaylist };
	return context;
};
