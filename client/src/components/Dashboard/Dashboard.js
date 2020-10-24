import React, { useEffect } from "react";
import styles from "./Dashboard.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import moment from "moment";
import DateNavigation from "./DateNavigation";
import Graph from "../Graph/Graph";
import Loading from "../Loading/Loading";
import List from './List';

const Dashboard = (props) => {

  const { date, intervalUnit } = props.data;

  useEffect(() => {
    window.scroll(0, 0);
    props.actions.parseData(null, "day");
    props.setTitle("");
    props.setRightComponent(null);
  }, []);

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
        props.setTitle(`${moment(props.data.date).format("Y")}/${moment(props.data.date).add(1, 'years').format("YY")}`);
        break;
    }
  }, [props.data.date, props.data.intervalUnit]);

  if (props.data.getItemsLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.wrapper}>
      <Graph {...props} />
      <div className={styles.divider} />
      <div className={styles.intervals}>
        <span className={`${intervalUnit === 'day' ? styles.activeInterval : ''} ${styles.interval}`} onClick={() => { props.actions.parseData(date, 'day'); }}>Day</span>
        <span className={`${intervalUnit === 'week' ? styles.activeInterval : ''} ${styles.interval}`} onClick={() => { props.actions.parseData(date, 'week'); }}>Week</span>
        <span className={`${intervalUnit === 'month' ? styles.activeInterval : ''} ${styles.interval}`} onClick={() => { props.actions.parseData(date, 'month'); }}>Month</span>
        <span className={`${intervalUnit === 'year' ? styles.activeInterval : ''} ${styles.interval}`} onClick={() => { props.actions.parseData(date, 'year'); }}>Year</span>
      </div>
      <List />
      <div className={styles.breakdowns}>
        <DateNavigation
          parseData={(date) => {
            props.actions.parseData(date, intervalUnit);
          }}
          intervalUnit={intervalUnit}
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
