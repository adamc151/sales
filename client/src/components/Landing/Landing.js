import React, { useEffect } from "react";
import styles from "./Landing.module.css";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { FaCashRegister, FaUser, FaBell } from "react-icons/fa";
import Loading from "../UI/Loading";
import { getGreeting, tillFloatPopup } from '../Utils/utils';
import moment from "moment";

const TopRight = (props) => {
  return (
    <>
      <div
        className={styles.addSale}
        onClick={async () => {
          tillFloatPopup(props.data.tillFloat, props.actions.postTillFloat);
        }}
      >
        <FaCashRegister size={"25px"} />
      </div>
    </>
  );
};

const ListItem = ({ name, onClick }) => (
  <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}><FaUser /></div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>{name}</div>
    </div>
  </div>
);

const Notification = ({ message, dateTime, onClick }) => {
  return <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}><FaBell /></div>
    <div className={styles.notificationWrapper}>
      <div className={styles.notificationTime}>{`${moment(dateTime).format("D MMM")} ${moment(dateTime).format("LT")}`}</div>
      <div className={styles.productInfo}>{message.split('\r\n').map((m) => {
        return <div>{m}</div>;
      })}</div>
    </div>
  </div>
};

const Landing = (props) => {
  useEffect(() => {
    props.setTitle(getGreeting());
    props.setLeftComponent(null);
    props.setRightComponent(() => {
      return <TopRight {...props} />;
    });
    props.actions.parseData(null, "day");
    props.actions.getTillFloat();
    props.actions.getTeam();
  }, []);

  useEffect(() => {
    props.auth.isOwner && !props.data.getNotifictionsLoading && props.actions.getNotifications();
  }, [props.auth]);

  useEffect(() => {
    window.scroll(0, 0);
  }, [props.data.notifications]);

  useEffect(() => {
    props.setRightComponent(() => {
      return <TopRight {...props} />;
    });
  }, [props.data.tillFloat]);

  if (!props.data.data && props.data.getItemsLoading) {
    return <Loading />;
  }

  if (!props.data.data) {
    return null;
  }

  const teamMembers = props.data.team;
  const notifications = props.data.notifications;

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {props.auth.isOwner && notifications && notifications.length ? <>{notifications.map((notification, i) => {
          return (
            <Notification
              {...notification}
              key={`notification${i}`}
            />
          );
        })}
          <div
            className={styles.eod}
            onClick={async () => {
              await props.actions.clearNotifications();
              props.actions.getNotifications();
            }}
          >
            Clear Notifications
            </div>
          <div className={styles.divider}></div>
        </> : null}
        {teamMembers && teamMembers.length > 0 && teamMembers.map((item, i) => {
          return (
            <ListItem
              {...item}
              key={`team_member_${i}`}
              onClick={() => {
                props.history.push(`/add?user=${item.name}`); // In this case name needs to be unique or else bug city.
              }}
            />
          );
        })}
        {teamMembers && teamMembers.length > 0 && <div // A button with styling might be better here?
          className={styles.eod}
          onClick={() => {
            props.history.push("/eod");
          }}
        >
          End of Day
            </div>}
        {!teamMembers || teamMembers.length == 0 && <div>
          No team members found.
        </div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
