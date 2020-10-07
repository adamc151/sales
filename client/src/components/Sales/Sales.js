import React, { useEffect, useState } from "react";
import styles from "./Sales.module.css";
import {
  FaCcAmex,
  FaMoneyBillAlt,
  FaCreditCard,
  FaPlus,
  FaCalendarAlt,
} from "react-icons/fa";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import Loading from "../Loading/Loading";
import { withRouter } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";

const paymentMethodIcons = {
  CASH: <FaMoneyBillAlt color={"#53a957"} />,
  CARD: <FaCreditCard color={"#d5ad43"} />,
  AMEX: <FaCcAmex color={"#016fcf"} />,
};

const ListItem = ({
  isExpense,
  details,
  paymentMethod,
  value,
  isActive,
  setActive,
  dateTime,
  _id,
  onDelete,
}) => (
  <div className={styles.listItemWrapper} onClick={() => setActive()}>
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
        {isExpense ? "- " : ""}£{value}
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
      <div className={styles.calenderIcon}>
        {false && <FaCalendarAlt size={"28px"} />}
      </div>
      <div
        className={styles.addSale}
        onClick={() => {
          props.history.push("/choose");
        }}
      >
        <FaPlus size={"28px"} />
      </div>
    </>
  );
};

const Sales = (props) => {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    window.scroll(0, 0);
    props.setTitle("Sales");
    props.setRightComponent(
      <TopRight {...props} isOwner={props.auth.isOwner} />
    );
    props.setLeftComponent(null);

    props.actions.loadItems();
  }, []);

  if (props.data.salesLoading) {
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
                  <div className={styles.dateHeader}>
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
