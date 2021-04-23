import * as React from 'react';
import { AuthProvider } from '~auth.context';
import { AppRouter } from '~components/AppRouter';

export const App = () => {
    return (
        <React.StrictMode>
            <AuthProvider>
                <AppRouter/>
            </AuthProvider>
        </React.StrictMode>
    );
};
