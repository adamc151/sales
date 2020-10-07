import React from "react";
import styles from "./Button.module.css";

export const Button = (props) => {
  return (
    <button
      className={styles.confirm}
      onClick={props.onClick}
      style={props.style}
    >
      {props.isLoading ? (
        <div className={styles.wrapper}>
          <div className={styles.spinner}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className={styles.bounce3}></div>
          </div>
        </div>
      ) : (
        props.children
      )}
    </button>
  );
};
