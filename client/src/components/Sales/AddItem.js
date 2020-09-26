import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import styles from "./AddItem.module.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCcAmex,
  FaMoneyBillAlt,
  FaCreditCard,
  FaAngleLeft,
} from "react-icons/fa";
import Team from "./Team";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { Redirect, withRouter } from "react-router";
import { AuthContext } from "../../Auth";

const paymentMethodIcons = {
  CASH: <FaMoneyBillAlt color={"#53a957"} size={"28px"} />,
  CARD: <FaCreditCard color={"#d5ad43"} size={"20px"} />,
  AMEX: <FaCcAmex color={"#016fcf"} size={"24px"} />,
};

const MyDatePicker = ({ date, setDate }) => {
  return (
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      locale="pt-BR"
      showTimeSelect
      timeFormat="p"
      timeIntervals={15}
      dateFormat="Pp"
      inline
    />
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const AddItem = (props) => {
  const { token } = useContext(AuthContext);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [price3, setPrice3] = useState(0);
  const [paymentType, setPaymentType] = useState("CARD");
  const [redirect, setRedirect] = useState(false);

  const prevLoading = usePrevious(props.data.addItemLoading);

  useEffect(() => {
    // props.setTitle(`Add Item (${props.teamMember})`);
    props.setTitle(`Add Sale`);

    props.setLeftComponent(() => (
      <div
        className={styles.backNavigation}
        onClick={() => {
          // props.setTeamMember(null);
          props.history.goBack();
        }}
      >
        <FaAngleLeft size={"32px"} />
      </div>
    ));
    props.setRightComponent(null);

    if (prevLoading && !props.data.addItemLoading) {
      if (!props.data.error) {
        setRedirect(true);
      }
    }
  }, [props.data.addItemLoading]);

  const buttonText = () => {
    return `Add £${(price1 + price2 + price3).toFixed(2)}`;
  };

  // const handleSubmit = useCallback(async (e) => {
  //   // e.preventDefault();
  //   try {
  //     props.setTitle(`Hit return`);
  //     e.currentTarget.blur();
  //     // await app.auth().signInWithEmailAndPassword(username, password);
  //     // history.push("/today");
  //   } catch (error) {
  //     // alert(error);
  //   }
  // }, []);

  if (redirect) {
    return <Redirect to={"/today"} />;
  }

  const handleSumbit = (e) => {
    e.preventDefault();
    e.target.querySelector("input").blur();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.dateWrapper}>
        <span className={styles.date}>{moment(date).format("LLL")}</span>
        <span
          className={styles.changeDate}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {showDatePicker ? "Done" : "Change"}
        </span>
      </div>
      {showDatePicker && (
        <div className={styles.datePicker}>
          <MyDatePicker date={date} setDate={setDate} />
        </div>
      )}

      <div>
        <div className={styles.sectionText}>Spectacles/Contact Lenses (£)</div>
        <div className={styles.priceWrapper}>
          <form style={{ width: "100%" }} onSubmit={handleSumbit}>
            <input
              className={`${styles.longInput}`}
              type="number"
              placeholder="0.00"
              onChange={(e) => {
                setPrice1(Number(e.target.value));
              }}
            />
          </form>
        </div>
      </div>

      <div>
        <div className={styles.sectionText}>Accessories (£)</div>
        <div className={styles.priceWrapper}>
          <form style={{ width: "100%" }} onSubmit={handleSumbit}>
            <input
              className={`${styles.longInput}`}
              type="number"
              placeholder="0.00"
              onChange={(e) => {
                setPrice2(Number(e.target.value));
              }}
            />
          </form>
        </div>
      </div>
      <div>
        <div className={styles.sectionText}>Fees (£)</div>
        <div className={styles.priceWrapper}>
          <form style={{ width: "100%" }} onSubmit={handleSumbit}>
            <input
              className={`${styles.longInput}`}
              type="number"
              placeholder="0.00"
              onChange={(e) => {
                setPrice3(Number(e.target.value));
              }}
            />
          </form>
        </div>
      </div>
      <div>
        <div className={styles.sectionText}>Product</div>
        <input className={styles.longInput} type="text" />
      </div>
      <div className={styles.sectionText}>Payment Method</div>

      <div className={styles.multiselectWrapper}>
        <div
          className={`${styles.optionWrapper} ${
            paymentType === "CARD" ? styles.isSelected : ""
          }`}
          onClick={() => setPaymentType("CARD")}
        >
          <div>{paymentMethodIcons.CARD}</div>
          <div>CARD</div>
        </div>
        <div
          className={`${styles.optionWrapper} ${
            paymentType === "CASH" ? styles.isSelected : ""
          }`}
          onClick={() => setPaymentType("CASH")}
        >
          <div>{paymentMethodIcons.CASH}</div>
          <div>CASH</div>
        </div>
        <div
          className={`${styles.optionWrapper} ${
            paymentType === "AMEX" ? styles.isSelected : ""
          }`}
          onClick={() => setPaymentType("AMEX")}
        >
          <div>{paymentMethodIcons.AMEX}</div>
          <div>AMEX</div>
        </div>
        <div
          className={`${styles.optionWrapper} ${
            paymentType === "OTHER" ? styles.isSelected : ""
          }`}
          onClick={() => setPaymentType("OTHER")}
          style={{ marginRight: "0px" }}
        >
          {"Other"}
        </div>
      </div>

      {false && paymentType === "OTHER" && <div>Other Options</div>}

      <button
        className={styles.confirm}
        onClick={async () => {
          await props.actions.postItem(
            {
              dateTime: date.toISOString(),
              value: (price1 + price2 + price3).toFixed(2),
              paymentMethod: paymentType,
            },
            token
          );
        }}
      >
        {buttonText()}
      </button>
    </div>
  );
};

const AddItemWrapper = (props) => {
  const [teamMember, setTeamMember] = useState(null);

  return true ? (
    <AddItem teamMember={teamMember} setTeamMember={setTeamMember} {...props} />
  ) : (
    <Team setTeamMember={setTeamMember} {...props} />
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
)(withRouter(AddItemWrapper));
