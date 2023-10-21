import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
	api: {
		externalResolver: true,
	},
};

export default async function handler(req, res) {
	const refresh = req.query.refresh_token;

	const encoded = Buffer.from(
		process.env['SPOT_ID'] + ':' + process.env['SPOT_SECRET'],
	).toString('base64');

	const grant = `grant_type=refresh_token&refresh_token=${refresh}&client_id=${process.env['SPOT_ID']}&client_secret=${process.env['SPOT_SECRET']}`;
	console.log(grant);
	const spotifyRes = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Header': '*',
			'Cache-Control': 'no-cache',
			Authorization: `Basic ${encoded}`,
		},
		body: `grant_type=refresh_token&refresh_token=${refresh}`,
	});
	const response = await spotifyRes.json();
	console.log(response);
	if (response.status === 200) {
		res.status(200).send(response.data);
	} else {
		res.status(spotifyRes.status).send(response);
	}
}
