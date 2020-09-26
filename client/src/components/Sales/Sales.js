import React, { useEffect, useState, useContext } from "react";
import styles from "./Sales.module.css";
import {
  FaCcAmex,
  FaMoneyBillAlt,
  FaCreditCard,
  FaPlus,
  FaCalendarAlt,
  FaAngleLeft,
} from "react-icons/fa";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import Loading from "../Loading/Loading";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../../Auth";
import moment from "moment";

const paymentMethodIcons = {
  CASH: <FaMoneyBillAlt color={"#53a957"} />,
  CARD: <FaCreditCard color={"#d5ad43"} />,
  AMEX: <FaCcAmex color={"#016fcf"} />,
};

const ListItem = ({
  isExpense,
  productDescription,
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
              {productDescription}
            </div>
          </div>
        ) : (
          <div className={styles.productDescription}>
            <span>{moment(dateTime).format("LT")}</span>
            <span className={styles.productDescriptionText}>
              {" "}
              {productDescription ? "- " : ""}
              {productDescription}
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
          <span>Edit</span>
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
  const { token, isOwner } = useContext(AuthContext);

  useEffect(() => {
    window.scroll(0, 0);
    props.setTitle("Sales");
    props.setRightComponent(<TopRight {...props} isOwner={isOwner} />);
    props.setLeftComponent(null);

    props.actions.loadItems(token);
  }, []);

  if (props.data.salesLoading) {
    return <Loading />;
  }

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      await props.actions.deleteItem(id, token);
      props.actions.loadItems(token);
      setActiveItem(null);
    }
  };

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {props.data.items &&
          props.data.items
            .slice(0)
            .reverse()
            .map((item, i) => {
              return (
                <ListItem
                  {...item}
                  onDelete={deleteItem}
                  setActive={() =>
                    i === activeItem ? setActiveItem(null) : setActiveItem(i)
                  }
                  isActive={i === activeItem}
                />
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
