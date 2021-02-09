import React, { ReactElement, useEffect, useState } from "react";

type TimerProps = {
    seconds: number;
};

const formatTime = (leftSeconds: number): string => {
    const hours = Math.floor(Number(leftSeconds.toString()) / 3600);
    const minutes = Math.floor(Number(leftSeconds.toString()) / 60) - hours * 60;
    const seconds = leftSeconds - hours * 3600 - minutes * 60;
    const h = hours < 10 ? "0" + hours : hours;
    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;
    return h + ":" + m + ":" + s;
};

export default function Timer(props: TimerProps): ReactElement {
    const [leftSeconds, setSeconds] = useState(0);
    let counter = props.seconds;

    useEffect(() => {
        setSeconds(props.seconds);
        setInterval(() => setSeconds(--counter), 1000);
    }, [counter, props.seconds]);

    return <div>{formatTime(leftSeconds)}</div>;
}
