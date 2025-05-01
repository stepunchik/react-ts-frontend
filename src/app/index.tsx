import { RouterProvider } from 'react-router-dom';
import { router } from './routers';
import { ContextProvider } from './providers/ContextProvider';

export const App = () => {
    return (
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    );
};
