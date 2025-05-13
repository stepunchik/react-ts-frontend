import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface StateContextType {
    user: any;
    token: string | null;
    setUser: Dispatch<SetStateAction<any>>;
    setToken: (token: string | null) => void;
}

const StateContext = createContext<StateContextType>({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

interface ContextProviderProps {
    children?: ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const [user, setUser] = useState<any>(null);
    const [token, _setToken] = useState<string | null>(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    return (
        <StateContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
            }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
