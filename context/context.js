import React, { createContext, useState } from "react";

export const Context = createContext(null);

const ContextProvider = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Context.Provider value={{
                isLoading,
                // setIsLoading,
            }}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;