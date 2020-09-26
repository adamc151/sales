import React, { useEffect, useState, useContext, useRef } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddExpense.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { Redirect, withRouter } from "react-router";
import { AuthContext } from "../../Auth";

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

const AddExpense = (props) => {
  const { token } = useContext(AuthContext);

  const [price1, setPrice1] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const prevLoading = usePrevious(props.data.addItemLoading);

  useEffect(() => {
    props.setTitle("Add Expense");
    props.setRightComponent(null);

    if (prevLoading && !props.data.addItemLoading) {
      if (!props.data.error) {
        setRedirect(true);
      }
    }
  }, [props.data.addItemLoading]);

  if (redirect) {
    return <Redirect to={"/today"} />;
  }

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
        <div className={styles.sectionText}>Expense (£)</div>
        <div className={styles.priceWrapper}>
          <input
            className={`${styles.longInput} ${styles.longInputPrice}`}
            type="number"
            placeholder="0.00"
            onChange={(e) => {
              setPrice1(Number(e.target.value));
            }}
          />
        </div>
      </div>

      <div>
        <div className={styles.sectionText}>Description</div>
        <input className={styles.longInput} type="text" />
      </div>
      <button
        className={styles.confirm}
        onClick={async () => {
          await props.actions.postItem(
            {
              dateTime: date.toISOString(),
              value: price1.toFixed(2),
              isExpense: true,
            },
            token
          );
        }}
      >
        Add £{price1.toFixed(2)}
      </button>
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
)(withRouter(AddExpense));
