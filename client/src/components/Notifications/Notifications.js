import React, { useEffect } from "react";
import styles from "./Notifications.module.css";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { FaCashRegister, FaBell, FaAngleLeft } from "react-icons/fa";
import Loading from "../UI/Loading";
import { tillFloatPopup } from '../Utils/utils';
import moment from "moment";

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
        props.setTitle("Notifications");
        props.setLeftComponent(<div
            className={styles.backNavigation}
            onClick={() => {
                props.history.goBack();
            }}
        >
            <FaAngleLeft size={"32px"} />
        </div>);
        props.setRightComponent(null);
        props.actions.parseData(null, "day");
        props.auth.isOwner && !props.data.getNotifictionsLoading && props.actions.getNotifications();
    }, []);

    useEffect(() => {
        window.scroll(0, 0);
    }, [props.data.notifications]);

    if (!props.data.data && props.data.getItemsLoading) {
        return <Loading />;
    }

    if (!props.data.data) {
        return null;
    }

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
                </> : <div>You currently have 0 notifications</div>}
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
