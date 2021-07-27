import React, {useEffect, useState} from 'react';

type ErrorMessageProps = {
    text: string;
};

const ErrorMessage = (props: ErrorMessageProps) => {
    return (
        <div className="p-2">
            <div className="inline-flex items-center bg-white leading-none text-pink-600 rounded-full p-2 shadow text-teal text-sm">
                <span className="inline-flex bg-pink-600 text-white rounded-full h-6 px-3 justify-center items-center">Error</span>
                <span className="inline-flex px-2">{props.text}</span>
            </div>
        </div>
    );
};

type Error = {
    id: number;
    text: string;
};

export const useErrorContainer = () => {
    const [list, setList] = useState<Error[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setList((arr) => {
                arr.shift();
                return arr;
            });
        }, 1000);
    }, [list]);

    return [
        (error: string) => {
            setList((arr) => {
                return arr.concat({
                    id: arr.length + 1,
                    text: error,
                });
            });
        },
        <div className="absolute bottom-0 right-0">
            {list.reverse().map(({id, text}) => <ErrorMessage key={String(id)} text={text}/>)}
        </div>
    ];
};
