import React, { useState, useRef, useEffect } from "react";
import FileDrop from "./FileDrop";
import styles from "./Upload.module.css";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { withRouter } from "react-router";
import { Button } from "../UI/Button";
import Swal from "sweetalert2";

const ListItem = ({ dateTime, value }) => (
  <div className={styles.listItemWrapper} >
    <div className={styles.initial}>{moment(dateTime).format("D MMM Y")}</div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>£{value}</div>
    </div>
  </div>
);

const parseItemsFromText = (text, uploadFormat) => {
  const myItems = [];

  if (uploadFormat === 'JSON' && text) {
    console.log('yooo parse', JSON.parse(text));
    return JSON.parse(text);
  }

  if (uploadFormat === 'CSV' && text) {
    const items = text && text.split("\r\n");
    console.log("yoooo items", items);

    if (items && items.length) {
      console.log('yooo items', items);
      items.pop();
      items.map((item, i) => {
        const [dateTime, value] = item.split(",");
        var myDate;
        console.log('yoooo dateTime', dateTime);
        const splitDate = dateTime.split('/');
        console.log('yoooo splitDate', splitDate);
        const month = splitDate[1] - 1; //Javascript months are 0-11
        myDate = new Date(splitDate[2], month, splitDate[0]);

        console.log('yoooo myDate', myDate);

        myItems.push({ value, dateTime: myDate.toISOString(), type: 'DAILY' });
      });
    }
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
  const prevLoading = usePrevious(props.data.addItemLoading);
  const [uploadFormat, setUploadFormat] = useState('JSON');
  const items = parseItemsFromText(files[0], uploadFormat);

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
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        <div className={styles.multiselectWrapper}>
          <div
            className={`${styles.optionWrapper} ${uploadFormat === "JSON" ? styles.isSelected : ""
              }`}
            onClick={() => setUploadFormat("JSON")}
          >
            <div>JSON</div>
          </div>
          <div
            className={`${styles.optionWrapper} ${uploadFormat === "CSV" ? styles.isSelected : ""
              }`}
            onClick={() => setUploadFormat("CSV")}
          >
            <div>CSV</div>
          </div>
        </div>
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
    </div>
  );
};

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
