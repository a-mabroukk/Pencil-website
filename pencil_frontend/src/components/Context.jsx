import React, { createContext, useState } from "react";

// Create a context for user data
const Context = createContext(undefined);

// Provider component to wrap around parts of the app that need access to user data
export const UserProvider = ({ children }) => {
    // Initialize user data state (could be null or an object)
    const [userData, setUserData] = useState(null); // or use {} for an empty object

    return (
        <Context.Provider value={{ userData, setUserData }}>
            {children}
        </Context.Provider>
    );
};

// Export the context to use in components
export default Context;
