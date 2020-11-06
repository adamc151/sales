import React, { useRef, useEffect, useState } from "react";
import styles from "./Settings.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import Loading from "../UI/Loading";
import { withRouter } from "react-router";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

const Settings = (props) => {
    const prevLoading = usePrevious(props.data.getItemsLoading);

    useEffect(() => {
        window.scroll(0, 0);
        props.setTitle("Account Settings");
        props.setRightComponent(null);
        props.setLeftComponent(null);
    }, []);

    if (props.data.getItemsLoading) {
        return <Loading />;
    }

    return (
        <div className={styles.listDesktopWrapper}>
            <div className={styles.listWrapper}>

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Settings));
