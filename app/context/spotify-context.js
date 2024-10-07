'use client';

import React from 'react';
const SpotifyContext = React.createContext(null);
export default SpotifyContext;

export function SpotifyClientProvider({ children }) {
	const [spotifyClient, setSpotifyClient] = React.useState(null);

	React.useEffect(() => {
		// const client = new ();
		setSpotifyClient(client);
	}, []);

	const context = {
		spotifyClient,
	};

	return (
		<SpotifyContext.Provider value={context}>
			{children}
		</SpotifyContext.Provider>
	);
}

export function useSpotifyContext() {
	const context = React.useContext(SpotifyContext);
	if (!context) {
		throw new Error('useSpotifyContext must be used within a SpotifyProvider');
	}
	return context;
}

// first attempt
// const ContextProvider = (props) => {
//     const [isLoading, setIsLoading] = useState(true);

//     return (
//         <Context.Provider value={{
//                 isLoading,
//                 // setIsLoading,
//             }}>
//             {props.children}
//         </Context.Provider>
//     );
// };

// export default ContextProvider;
