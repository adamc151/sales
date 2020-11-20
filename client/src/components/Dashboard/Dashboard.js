import React, { useEffect } from "react";
import styles from "./Dashboard.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import DateNavigation from "./DateNavigation";
import Graph from "./Graph";
import Loading from "../UI/Loading";
import List from './List';
import { FiDownload } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { getDateLabel, exportData } from '../Utils/utils';
import { withRouter } from "react-router";


const TopRight = (props) => {
  return (
    <div>
      <div
        className={styles.notificationsLink}
        onClick={() => {
          props.history.push("/notifications");
        }}
      >
        {props.data.notifications && props.data.notifications.length ? <div className={styles.dot} /> : null}
        <FaBell size={"25px"} />
      </div>
      <div
        className={styles.addSale}
        onClick={() => {
          exportData(props);
        }}
      >
        <FiDownload size={"25px"} />
      </div>
    </div>
  );
};

const Dashboard = (props) => {

  const { date, intervalUnit } = props.data;

  useEffect(() => {
    window.scroll(0, 0);
    props.actions.parseData(null, "day");
    props.setTitle("");
    props.setRightComponent(<TopRight {...props} />);
    props.setLeftComponent(null);
  }, []);

  useEffect(() => {
    props.auth.isOwner && !props.data.getNotifictionsLoading && props.actions.getNotifications();
  }, [props.auth]);

  useEffect(() => {
    // if notifications > 1 show button
    props.setRightComponent(<TopRight {...props} />);
  }, [props.data.notifications]);

  useEffect(() => {
    props.setRightComponent(<TopRight {...props} />);
  }, [props.data.data]);

  useEffect(() => {
    props.setTitle(getDateLabel(props.data.date, props.data.intervalUnit));
  }, [props.data.date, props.data.intervalUnit]);

  if (props.data.getItemsLoading) {
    return <Loading />;
  }

  console.log('yoooo props', props);

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
      <List {...props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));
