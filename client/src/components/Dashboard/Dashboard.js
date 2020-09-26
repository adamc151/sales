import React, { useContext, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { FaCalendarAlt } from "react-icons/fa";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import moment from "moment";
import Breakdowns from "./Breakdowns";
import { AuthContext } from "../../Auth";
import Graph from "../Graph/Graph";

const ChangeInterval = ({ parseData, date }) => (
  <div className={styles.calender}>
    <select
      name="changeInterval"
      id="changeInterval"
      className={styles.select}
      onChange={(e) => {
        parseData(date, e.target.value);
      }}
    >
      <option value="day">Day</option>
      <option value="week">Week</option>
      <option value="month">Month</option>
      <option value="year">Year</option>
    </select>
    <div className={styles.calenderIcon}>
      <FaCalendarAlt size={"28px"} />
    </div>
  </div>
);

const Dashboard = (props) => {
  const chartRef = useRef(null);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    window.scroll(0, 0);
    props.actions.parseData(null, "day", token);
    props.setTitle("Metrics");
    props.setRightComponent(
      <ChangeInterval
        parseData={props.actions.parseData}
        date={props.data.date}
      />
    );
  }, [token]);

  useEffect(() => {
    switch (props.data.intervalUnit) {
      case "day":
        props.setTitle(`${moment(props.data.date).format("ddd D MMM YY")}`);
        break;
      case "week":
        props.setTitle(
          `${moment(props.data.date)
            .startOf("isoWeek")
            .format("D MMM YY")} - ${moment(props.data.date)
            .endOf("isoWeek")
            .format("D MMM YY")}`
        );
        break;
      case "month":
        props.setTitle(`${moment(props.data.date).format("MMMM Y")}`);
        break;
      case "year":
        props.setTitle(`${moment(props.data.date).format("Y")}`);
        break;
    }
  }, [props.data.date]);

  // if(props.data.loading){
  //   return <Loading />;
  // }

  return (
    <div className={styles.wrapper}>
      <Graph {...props} />
      <div className={styles.breakdowns}>
        <Breakdowns
          parseData={(date) => {
            props.actions.parseData(date, props.data.intervalUnit);
          }}
          intervals={props.data.intervals}
          date={props.data.date}
          breakdowns={props.data.breakdowns}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
