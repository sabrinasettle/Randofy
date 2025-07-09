var clientId = process.env['SPOT_ID'];
var redirect_uri =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:3000/'
		: 'https://randofy.vercel.app/';

export default function handler(req, res) {
	const scopes = 'user-read-private user-read-email playlist-modify-public';

	res.redirect(
		'https://accounts.spotify.com/authorize' +
			'?response_type=code' +
			'&client_id=' +
			clientId +
			(scopes ? '&scope=' + scopes : '') +
			'&redirect_uri=' +
			redirect_uri,
	);
}
