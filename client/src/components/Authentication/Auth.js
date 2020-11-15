import React, { useEffect, useState } from "react";
import app from "./firebase.js";
import Loading from "../UI/Loading";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/authActions";

export const AuthContext = React.createContext();

export const AuthProvider = connect(
    mapStateToProps,
    mapDispatchToProps
)(({ children, actions, auth }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isOwner, setOwner] = useState(false);
    const [pending, setPending] = useState(true);

    const updateAuthState = (user, auth) => {
        if (user) {
            user.getIdToken().then(async (token) => {

                setToken(token);
                console.log('yooo auth', auth);
                try {
                    //set current User AFTER token and isOwner  
                    await actions.updateAuth({ token, displayName: user.displayName });
                    const userSummary = await actions.getUser();
                    console.log('yoooo userSummary', userSummary);
                    setOwner(userSummary && userSummary.isOwner);
                    setCurrentUser(user);
                    setPending(false);
                } catch (e) {
                    console.log('yooooo error', e);
                    setPending(false);
                }

            });
        } else {
            setCurrentUser(user);
            setPending(false);
        }
    }

    useEffect(() => {
        // app.auth().onIdTokenChanged((user) => {
        //     updateAuthState(user, auth);
        // });

        app.auth().onAuthStateChanged((user) => {
            updateAuthState(user, auth);
        });
    }, []);

    if (pending) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                token,
                isOwner,
                setOwner,
                pending
            }}
        >
            {children}
        </AuthContext.Provider>
    );
});

function mapStateToProps(state) {
    console.log('yoooo state', state);
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}
