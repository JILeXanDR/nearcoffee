import * as React from 'react';
import { useAuth } from './auth.context';

const styles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '4px',
    backgroundColor: '#bababa',
};

export const Debug = () => {
    const auth = useAuth();
    console.log(auth);
    return (
        <div style={styles}>
            <pre>{JSON.stringify(auth)}</pre>
        </div>
    );
};
