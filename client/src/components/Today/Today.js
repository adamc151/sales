import React, { useEffect, useState, useContext } from "react";
import styles from "./Today.module.css";
import { withRouter } from "react-router";
import Graph from "../Graph/Graph";
import MyPieChart from "../Graph/PieChart";
import moment from "moment";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { AuthContext } from "../../Auth";
import { FaPlus, FaCashRegister } from "react-icons/fa";

const TopRight = (props) => {
  return (
    <>
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

const Today = (props) => {
  const { token } = useContext(AuthContext);
  const [tillFloat, setTillFloat] = useState(null);

  useEffect(() => {
    props.setTitle("Today");
    props.setLeftComponent(null);
    props.setRightComponent(null);
    props.actions.parseData(null, "day", token);
  }, []);

  if (!props.data.data) {
    return null;
  }

  let isToday = false;
  if (props.data.data && props.data.data.length) {
    const currentDate = new Date();
    isToday = moment(currentDate).isSame(
      moment(props.data.data[props.data.data.length - 1].dateTime),
      "day"
    );
  }
  return (
    <div className={styles.wrapper}>
      {tillFloat && (
        <div className={styles.floatWrapper}>
          <FaCashRegister size={"25px"} />
          <div style={{ marginLeft: "8px" }}>£{tillFloat}</div>
        </div>
      )}
      {isToday ? (
        <div>
          <Graph {...props} />
          <button
            style={{ marginTop: "32px" }}
            className={styles.confirm}
            onClick={() => {
              props.history.push("/choose");
            }}
          >
            Add Item
          </button>
          <div
            className={styles.eod}
            onClick={() => {
              props.history.push("/eod");
            }}
          >
            End of Day
          </div>
        </div>
      ) : (
        <Empty {...props} setTillFloat={setTillFloat} />
      )}
    </div>
  );
};

const Empty = (props) => {
  var hr = new Date().getHours();
  let greeting = "";
  var data = [
    [0, 4, "Good Morning"],
    [5, 11, "Good Morning"],
    [12, 17, "Good Afternoon"],
    [18, 24, "Good Night"],
  ];

  for (var i = 0; i < data.length; i++) {
    if (hr >= data[i][0] && hr <= data[i][1]) {
      greeting = data[i][2];
    }
  }

  return (
    <div>
      <div className={styles.greeting}>{greeting}</div>
      <div className={styles.message}>
        There are no sales recorded for today yet
      </div>

      <div className={styles.buttonsWrapper}>
        <button
          className={styles.confirm}
          onClick={() => {
            props.history.push("/choose");
          }}
        >
          Add Item
        </button>
        <button
          className={styles.confirm}
          onClick={() => {
            // props.setTillFloat(240);
          }}
        >
          Add Till Float
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Today));
