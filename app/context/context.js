import { createContext } from "react";
const SpotifyContext = createContext(null);
export default SpotifyContext;

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
