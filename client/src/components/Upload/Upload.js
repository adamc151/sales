import React, { useState } from "react";
import FileDrop from "./FileDrop";
import styles from "./Upload.module.css";

const parseItemsFromText = (text) => {
  const myItems = [];
  console.log("yoooo text", JSON.stringify(text));
  const items = text && text.split("\r\n");
  console.log("yoooo items", items);

  if (items && items.length) {
    items.pop();
    items.map((item) => {
      const [value, dateTime] = item.split(",");
      myItems.push({ value, dateTime });
    });
  }

  console.log("yoooo myItems", myItems);
};

const Upload = () => {
  const [files, setFiles] = useState([]);

  const items = parseItemsFromText(files[0]);
  return (
    <div className={styles.wrapper}>
      <FileDrop setFiles={setFiles} files={files} />
    </div>
  );
};

export default Upload;
