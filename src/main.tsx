import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '~App';
import { useConfig } from '~config';
import '~index.css';
import { init, instance } from '~near.adapter';

// TODO: tiny-warning.esm.js:11 Warning: <BrowserRouter> ignores the history prop.
//  To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.

const config = useConfig();

init(config)
    .then((near) => {
        // @ts-ignore
        instance = near;
        ReactDOM.render(<App/>, document.querySelector('#root'));
    })
    .catch((e) => {
        console.error(`Failed to init NEAR: ${e.toString()}`);
    });
