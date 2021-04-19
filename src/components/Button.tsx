import * as React from 'react';

// export type Props = {
//     onClick: Function;
//     children: React.ReactNodeArray;
// };

interface Props {
    children: React.ReactNode;
}

export const Button = (props: Props) => {
    return (
        <div>
            <button
                {...props}
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {props.children}
            </button>
        </div>
    );
};
