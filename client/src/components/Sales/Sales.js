import React, { useRef, useEffect, useState } from "react";
import styles from "./Sales.module.css";
import {
  FaCcAmex,
  FaMoneyBillAlt,
  FaCreditCard,
  FaPlus,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import Loading from "../Loading/Loading";
import { withRouter } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";
import { saveAs } from 'file-saver';

const paymentMethodIcons = {
  CASH: <FaMoneyBillAlt color={"#53a957"} />,
  CARD: <FaCreditCard color={"#d5ad43"} />,
  AMEX: <FaCcAmex color={"#016fcf"} />,
};

const ListItem = ({
  type,
  details,
  paymentMethod,
  value,
  isActive,
  setActive,
  dateTime,
  _id,
  onDelete,
}) => (
    <div className={styles.listItemWrapper} onClick={() => setActive()} >
      <div>{paymentMethodIcons[paymentMethod]}</div>
      <div className={styles.detailsWrapper}>
        <div className={styles.productInfo}>
          {isActive ? (
            <div className={styles.productDescriptionActive}>
              <div>{moment(dateTime).format("LT")}</div>
              <div
                className={styles.productDescriptionText}
                style={{ marginTop: "8px" }}
              >
                {details}
              </div>
            </div>
          ) : (
              <div className={styles.productDescription}>
                <span>{moment(dateTime).format("LT")}</span>
                <span className={styles.productDescriptionText}>
                  {" "}
                  {details ? "- " : ""}
                  {details}
                </span>
              </div>
            )}
        </div>
        <div className={styles.productPrice}>
          {type === 'EXPENSE' || type === 'REFUND' ? "- " : ""}£{value}
        </div>
        {isActive && (
          <div className={styles.actions}>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onDelete(_id);
              }}
            >
              Delete
          </span>
            {/* <span>Edit</span> */}
          </div>
        )}
      </div>
    </div>
  );

const TopRight = (props) => {
  return (
    <>
      {props.isOwner ? <div className={styles.calenderIcon} onClick={() => {
        Swal.fire({
          text: 'Select format to download:',
          showDenyButton: true,
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: `JSON`,
          denyButtonText: `CSV`,
          cancelButtonText: `Close`,
        }).then((result) => {
          if (result.isConfirmed) {
            const blob = new Blob([JSON.stringify(props.data.items)], { type: 'application/json' });
            saveAs(blob, `${new Date()}.json`);
          } else if (result.isDenied) {
            let csv = "date,type,total value,lenses,accessories,fees\r\n";
            props.data.items.map((item) => {
              const value = item.type === 'REFUND' || item.type === 'EXPENSE' ? item.value * -1 : item.value;
              const { breakdown = {}, dateTime, type = '' } = item;
              const { lenses = 0, accessories = 0, fees = 0 } = breakdown;
              let myDate = moment(new Date(dateTime)).format("L");
              const splitDate = myDate.split('/');

              myDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`;
              csv = csv + `${myDate},${type},${value},${lenses},${accessories},${fees}\r\n`
            })
            console.log('yoooo csv', csv);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${new Date()}.csv`);
          }
        })
      }}>
        <FiDownload size={"28px"} />
      </div> : null}
      <div
        className={styles.addSale}
        onClick={() => {
          props.history.push("/home");
        }}
      >
        <FaPlus size={"28px"} />
      </div>
    </>
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Sales = (props) => {
  const [activeItem, setActiveItem] = useState(null);
  const prevLoading = usePrevious(props.data.getItemsLoading);

  useEffect(() => {
    window.scroll(0, 0);
    props.setTitle("Sales");
    props.setRightComponent(
      <TopRight {...props} isOwner={props.auth.isOwner} />
    );
    props.setLeftComponent(null);

    props.actions.loadItems();
  }, []);

  if (prevLoading && !props.data.getItemsLoading) {
    props.setRightComponent(
      <TopRight {...props} isOwner={props.auth.isOwner} />
    );
  }

  if (props.data.getItemsLoading) {
    return <Loading />;
  }

  const deleteItem = async (id) => {
    Swal.queue([
      {
        icon: "warning",
        text: "Are you sure you want to delete this item?",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return props.actions
            .deleteItem(id)
            .then(() => {
              setActiveItem(null);
              props.actions.loadItems();
              Swal.insertQueueStep({
                icon: "success",
                text: "Item successfully deleted",
                timer: 2000,
                showConfirmButton: false,
                showClass: {
                  popup: "",
                },
                allowOutsideClick: false,
              });
            })
            .catch(() => {
              Swal.showValidationMessage(`Something went wrong`);
            });
        },
      },
    ]);
  };

  const reversedItems = props.data.items && props.data.items.slice(0).reverse();

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {reversedItems &&
          reversedItems.map((item, i) => {
            const current = new Date(item.dateTime);
            const prev = i > 0 && new Date(reversedItems[i - 1].dateTime);
            const isSame = i > 0 && moment(prev).isSame(moment(current), "day");
            const date = item.dateTime;

            return (
              <>
                {!isSame && date && props.auth.isOwner && (
                  <div className={styles.dateHeader} >
                    {moment(date).format("dddd D MMM")}
                  </div>
                )}
                <ListItem
                  {...item}
                  onDelete={deleteItem}
                  setActive={() =>
                    i === activeItem ? setActiveItem(null) : setActiveItem(i)
                  }
                  isActive={i === activeItem}
                />
              </>
            );
          })}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sales));
