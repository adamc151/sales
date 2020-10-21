import React, { useState, useRef, useEffect } from "react";
import FileDrop from "./FileDrop";
import styles from "./Upload.module.css";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { Redirect, withRouter } from "react-router";
import { Button } from "../UI/Button";
import Swal from "sweetalert2";
// import { saveAs } from 'file-saver';


const ListItem = ({ dateTime, value }) => (
  <div className={styles.listItemWrapper} >
    <div className={styles.initial}>{moment(dateTime).format("D MMM Y")}</div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>£{value}</div>
    </div>
  </div>
);

const parseItemsFromText = (text) => {
  const myItems = [];
  console.log("yoooo text", JSON.stringify(text));
  console.log('yooo typeof text ', typeof text);

  if (typeof text === 'string') {
    console.log('yooo parse', JSON.parse(text));
  }


  const items = text && text.split("\r\n");
  console.log("yoooo items", items);

  if (items && items.length) {
    console.log('yooo items', items);
    items.pop();
    items.map((item) => {
      const [value, dateTime] = item.split(",");
      var myDate;
      const splitDate = dateTime.split('/');

      if (splitDate.length === 3) {
        const month = splitDate[1] - 1; //Javascript months are 0-11
        myDate = new Date(splitDate[2], month, splitDate[0]);
      } else {
        myDate = new Date(dateTime);
      }


      myItems.push({ value, dateTime: myDate.toISOString(), type: 'DAILY' });
    });
  }

  return myItems;
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Upload = (props) => {
  const [addButtonActive, setAddButtonActive] = useState(true);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [files, setFiles] = useState([]);
  const items = parseItemsFromText(files[0]);
  const prevLoading = usePrevious(props.data.addItemLoading);

  useEffect(() => {
    props.setTitle('Upload');
    props.setLeftComponent(null);
    props.setRightComponent(null);
    // props.actions.loadItems();

    if (prevLoading && !props.data.addItemLoading) {
      if (!props.data.error) {
        // const item = props.data.items[props.data.items.length - 1];
        Swal.fire({
          icon: "success",
          text: "Items added successfully",
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
        setUploadComplete(true);

      } else {
        setAddButtonActive(true);
      }
    }
  }, [props.data.addItemLoading]);


  return (
    <div className={styles.wrapper}>
      <FileDrop setFiles={setFiles} files={files} />
      {items.length ? items.map((item) => {
        return <ListItem {...item} />
      }) : ''}
      {items.length ? <Button
        className={`${styles.button} ${uploadComplete ? styles.uploadComplete : ''}`}
        isLoading={props.data.addItemLoading}
        onClick={async () => {
          if (addButtonActive && !uploadComplete && false) {
            setAddButtonActive(false);
            await props.actions.postItems(items);
          }
        }}
      >
        {!uploadComplete ? 'Upload' : 'Uploaded!'}
      </Button> : ''}
    </div>
  );
};

/*
<Button className={`${styles.button}`} onClick={() => {
        console.log('yoooo props', props);
        const blob = new Blob([JSON.stringify(props.data.items)], { type: 'application/json' });
        saveAs(blob, "hello world.json");
      }}>Export</Button>
      */

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Upload));
