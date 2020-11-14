import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./Settings.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/authActions";
import Loading from "../UI/Loading";
import { withRouter } from "react-router";
import app from "../Authentication/firebase.js";
import { Button } from '../UI/Button';
import Swal from "sweetalert2";


function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}


const AddStaffAccount = (props) => {
    const [emailRegister, setEmailRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");

    const handleRegister = async (event, email, password) => {
        event.preventDefault();
        try {
            // setRedirect(false);

            //Add User to db isOwner = FALSE
            props.actions.addUser({ isStaffAccount: true, email });

            await app.auth().createUserWithEmailAndPassword(email, password);
            await app.auth().currentUser.updateProfile({
                displayName: props.auth.displayName
            })

            // setRedirect(true);
        } catch (error) {
            console.log('yooo error', error);
            // setRedirect(true);
            // setErrorMessage(`${error}`);

            // remove user!
        }
    }

    return <form onSubmit={(e) => handleRegister(e, emailRegister, passwordRegister)} style={{ 'width': '100%' }}>
        <div className={styles.sectionText}>Please enter your email address:</div>
        <input
            className={styles.input}
            type="text"
            value={emailRegister}
            onChange={(e) => setEmailRegister(e.target.value)}
        />
        <div className={styles.sectionText}>Choose a password:</div>
        <input
            className={styles.input}
            type="password"
            value={passwordRegister}
            onChange={(e) => setPasswordRegister(e.target.value)}
        />
        {/* {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null} */}
        <Button className={styles.signIn} type="submit" isLoading={false}>
            Add Staff Account
        </Button>
    </form>
}

const Settings = (props) => {
    const prevLoading = usePrevious(props.data.getItemsLoading);

    const handleResetPassword = () => {
        props.actions.resetPassword(process.env.REACT_APP_FIREBASE_KEY);
        Swal.fire({
            icon: "success",
            title: `Password Reset`,
            text: `A reset link has been sent to your email address`,
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,
        });
    }

    useEffect(() => {
        window.scroll(0, 0);
        props.setTitle("Account Settings");
        props.setRightComponent(null);
        props.setLeftComponent(null);
    }, []);

    if (props.data.getItemsLoading) {
        return <Loading />;
    }

    console.log('yooo props', props);

    return (
        <div className={styles.listDesktopWrapper}>
            <div className={styles.listWrapper}>
                <div className={styles.sectionText}>Owner Details</div>
                <div className={styles.text}>{props.auth.displayName}</div>
                <div className={styles.text}>{props.auth.email}</div>

                <div className={styles.sectionText}>Staff Account</div>
                {props.auth.staffAccounts && props.auth.staffAccounts.length ?
                    <div>{props.auth.staffAccounts.map((account) => {
                        return <div className={styles.text}>{account}</div>;
                    })}</div>
                    : <AddStaffAccount {...props} />}
            </div>
            <div className={styles.listWrapper}>
                <div className={styles.sectionText}>Team Management</div>
                <div className={styles.text}>Team members here...</div>
            </div>
            <div className={styles.listWrapper}>
                <div className={styles.sectionText}>Account Management</div>
                <Button className={styles.signIn} style={{ 'width': '100%', 'margin-top': '20px' }} onClick={() => { handleResetPassword() }}>
                    Reset Password
                </Button>
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
