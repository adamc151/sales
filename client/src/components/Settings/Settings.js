import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./Settings.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/index";
import Loading from "../UI/Loading";
import { withRouter } from "react-router";
import { detachedApp as app } from "../Authentication/firebase.js";
import { Button } from '../UI/Button';
import Swal from "sweetalert2";
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { accountSettingsPopup } from '../Utils/utils';


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

            await app.auth().createUserWithEmailAndPassword(email, password).then(async () => {
                await props.actions.addUser({ isStaffAccount: true, email });
                await props.actions.getUser();
            });
            // await app.auth().currentUser.updateProfile({
            //     displayName: props.auth.displayName
            // })

            // setRedirect(true);
        } catch (error) {
            console.log('yooo error', error);
            // setRedirect(true);
            // setErrorMessage(`${error}`);

            // remove user!
        }
    }

    return <form onSubmit={(e) => handleRegister(e, emailRegister, passwordRegister)} style={{ 'width': '100%' }}>
        <div className={styles.staffAccountExplanation}>Add 'Staff Account' log in details so your staff can log in and add sales data for this shop. *Staff will only see sales data for the current day</div>
        <div className={styles.sectionText}>Choose an email address (sorry this cannot be the same as Owner email):</div>
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

const TeamMembers = (props) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [newTeamMember, setNewTeamMember] = useState('');

    const handleGetTeam = async () => {
        try {
            await props.actions.getTeam();
        } catch (error) {
            console.log('yooo error', error);
        }
    }

    const handleAddTeamMember = (event) => {
        event.preventDefault();
        if (!newTeamMember || newTeamMember == '') {
            return;
        }
        try {
            Swal.fire({
                text: "Do you want to add " + newTeamMember + "?",
                showConfirmButton: true,
                confirmButtonText: "Yes",
                showCancelButton: true,
                cancelButtonText: "No, Oops"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await props.actions.addTeamMember(newTeamMember, null);
                    console.log(newTeamMember);
                    setTeamMembers([...teamMembers, { id: '', name: newTeamMember }]);
                    setNewTeamMember('');
                    await props.actions.getTeam();
                } else if (result.isDenied) {
                    Swal.close();
                }
            });
        } catch (error) {
            console.log('yooo error', error);
        }
    }

    const handleTeamMemberDelete = async (id) => {
        try {
            console.log('Delete: ' + id);
            Swal.fire({
                text: "Are you sure? Once deleted, this can't be restored",
                showConfirmButton: true,
                confirmButtonText: "Yes, Delete",
                showCancelButton: true,
                cancelButtonText: "No, Oops"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await props.actions.deleteTeamMember(id, null);
                    const tmp = teamMembers.filter(member => member.id != id);
                    setTeamMembers(tmp);
                    await props.actions.getTeam();
                } else if (result.isDenied) {
                    Swal.close();
                }
            });
        } catch (error) {
            console.log('yooo error', error);
        }
    }

    useEffect(() => {
        handleGetTeam();
    }, []);

    useEffect(() => {
        setTeamMembers(props.data.team);
    }, [props.data.team]);

    return <div>
        <div>
            <div className={styles.sectionText}>Team Management</div>
            {teamMembers && teamMembers.map((member, index) => {
                return <div className={styles.editWrapper}>
                    <div className={styles.text}>{member.name}</div>
                    <FaWindowClose onClick={() => handleTeamMemberDelete(member.id)} style={{ 'padding-top': '5px' }} />
                    {/* <FaEdit /> */}
                </div>
            })}
            {teamMembers && !teamMembers.length ? <div className={styles.staffAccountExplanation}>Add 'Team Members' so your staff can add sales items by selecting their name on the 'Add Item' page</div> : null}
            <form onSubmit={(e) => handleAddTeamMember(e)} style={{ 'width': '100%' }}>
                <input
                    className={styles.input}
                    type="text"
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    style={{ 'margin-top': '20px' }}
                />
                <Button className={styles.signIn} type="submit" isLoading={false}>
                    Add Team Member
                </Button>
            </form>
        </div>
    </div>
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
                <div className={styles.sectionText}>Shop Name</div>
                <div className={styles.editWrapper}>
                    <div className={styles.text}>{props.auth.shopName}</div>
                    <div
                        className={styles.edit}
                        onClick={() => accountSettingsPopup(props.auth.shopName, 'Change shop name', 'Successfully changed shop name', async (newValue) => { await props.actions.changeShopName({ shopName: newValue }) })}
                    >
                        <FaEdit />
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.sectionText}>Owner Details</div>
                <div className={styles.editWrapper}>
                    <div className={styles.text}>{props.auth.email}</div>
                    <div className={styles.resetPassword} onClick={() => { handleResetPassword() }}>Reset Password</div>
                </div>

                {/* <Button className={styles.signIn} style={{ 'width': '100%', 'margin-top': '20px' }} onClick={() => { handleResetPassword() }}>
                    Reset Password
                </Button> */}

                <div className={styles.divider}></div>


                <div className={styles.sectionText}>Staff Account</div>
                {props.auth.staffEmail ?
                    <div className={styles.text}>{props.auth.staffEmail}</div> :
                    <AddStaffAccount {...props} />}

                <div className={styles.divider}></div>


                <TeamMembers {...props} />
            </div>


            {/* <div className={styles.listWrapper}>
                <div className={styles.sectionText}>Account Management</div>
                <Button className={styles.signIn} style={{ 'width': '100%', 'margin-top': '20px' }} onClick={() => { handleResetPassword() }}>
                    Reset Password
                </Button>
            </div> */}
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