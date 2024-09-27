import * as dotenv from 'dotenv';
dotenv.config();

export const currentRoutes = {
	LANDING: ['api/', 'Home Page'],
	LOGIN: ['api/login', 'login route using Spotify 2OAuth'],
	RANDOM: ['api/random', 'generates random song'],
	MARKDOWN: ['api/markdown', 'generates markdown compliant svg of random song'],
	TOKEN: ['api/token', 'generates token for Spotify 2OAuth'],
	SVG_S: ['api/svg-s', 'generates small svg of a random song'],
	SVG_M: ['api/svg-m', 'generates medium svg of a random song'],
	SVG_L: ['api/svg-l', 'generates large svg of a random song'],
};

export const config = {
	api: {
		externalResolver: true,
	},
};

export default function handler(req, res) {
	let returnHTML =
		'<h1>Randofy Backend Api </h1> <h2> Available Routes: </h2> <ul>';
	Object.keys(currentRoutes).map((key, index) => {
		returnHTML += `<li key=${index}> <a href="${currentRoutes[key][0]}"> <p>${currentRoutes[key][0]}: ${currentRoutes[key][1]} </p> </a> </li>`;
	});
	returnHTML += '</ul>';
	returnHTML +=
		'<a href="https://github.com/settleformore" target="_blank"> <h3>Idea and contributions by <strong> Sabrina Settle </strong> </h3> </a>';
	returnHTML +=
		'<a href="https://github.com/SLO42" target="_blank"> <h3>Backend created by <strong> Samuel Oliveira </strong> </h3> </a>';
	returnHTML +=
		'<a href="https://github.com/SLO42/Randofy-backend" target="_blank"> <h3>Find the github project here! </strong> </h3> </a>';

	res.status(200).send(returnHTML);
}
