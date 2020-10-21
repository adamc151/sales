import React, { useEffect } from "react";
import styles from "./List.module.css";

const ListItem = ({ name, onClick }) => (
    <div className={styles.listItemWrapper} onClick={onClick}>
        <div className={styles.initial}></div>
        <div className={styles.detailsWrapper}>
            <div className={styles.productInfo}>{name}</div>
        </div>
    </div>
);

const List = (props) => {
    return (
        <div className={styles.listDesktopWrapper}>
            <div className={styles.listWrapper}>
                {/* <ListItem />
                <ListItem />
                <ListItem /> */}
            </div>
        </div>
    );
};


export default List;