import React from "react";
import styles from "./Button.module.css";

export const Button = (props) => {
  return (
    <button className={styles.confirm} onClick={props.onClick}>
      {props.isLoading ? (
        <div className={styles.wrapper}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};
