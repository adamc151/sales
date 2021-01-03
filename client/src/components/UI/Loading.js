import React from "react";
import styles from "./Loading.module.css";

const Loading = ({ withSidebar }) => (
    <div className={styles.wrapper}>
        <div className={`${styles.spinner} ${withSidebar ? styles.withSidebar : ''}`}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className={styles.bounce3}></div>
        </div>
    </div>
);

export default Loading;