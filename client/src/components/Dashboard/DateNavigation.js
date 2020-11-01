import React, { useState, useEffect, useRef } from "react";
import styles from "./DateNavigation.module.css";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

const DateNavigation = (props) => {
    const { intervals, intervalUnit } = props;
    const [currentIndex, setIndex] = useState(intervals && intervals.length - 1);

    const prevIntervalUnit = usePrevious(intervalUnit);
    const prevIntervals = usePrevious(intervals);

    useEffect(() => {
        if (prevIntervalUnit !== intervalUnit) {
            setIndex(intervals && intervals.length - 1);
            if (intervals.length) {
                props.parseData(intervals[intervals.length - 1]);
            }
        } else if (!prevIntervals && intervals) {
            setIndex(intervals && intervals.length - 1);
            if (intervals.length) {
                props.parseData(intervals[intervals.length - 1]);
            }
        }
    }, [props.intervals])

    if (!props.intervals) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.navWrapper}>
                <div className={currentIndex === 0 ? styles.inactive : ''} onClick={() => {
                    if (currentIndex !== 0) {
                        props.parseData(intervals[0]);
                        setIndex(0);
                    }
                }}><BiLeftArrow size={'20px'} /></div>
                <div className={currentIndex === 0 ? styles.inactive : ''} onClick={() => {
                    if (currentIndex !== 0) {
                        props.parseData(intervals[currentIndex - 1]);
                        setIndex(currentIndex - 1);
                    }
                }}><GoArrowLeft size={'30px'} /></div>

                <div className={currentIndex === intervals.length - 1 ? styles.inactive : ''} onClick={() => {
                    if (currentIndex !== intervals.length - 1) {
                        props.parseData(intervals[currentIndex + 1]);
                        setIndex(currentIndex + 1);
                    }
                }}><GoArrowRight size={'30px'} /></div>
                <div className={currentIndex === intervals.length - 1 ? styles.inactive : ''} onClick={() => {
                    if (currentIndex !== intervals.length - 1) {
                        props.parseData(intervals[intervals.length - 1]);
                        setIndex(intervals.length - 1);
                    }
                }}><BiRightArrow size={'20px'} /></div>
            </div>
        </div>
    );

}

export default DateNavigation;
