import * as React from 'react';
import { useState } from 'react';
import { Card } from '~components/Card';

export const SettingsTab = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    if (loading) {
        return <h1>loading...</h1>;
    }

    return (
        <>
            <Card classes={[]}>
                <h1>Settings tab</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </Card>
        </>
    );
};
