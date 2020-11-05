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
)(({ children, actions }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isOwner, setOwner] = useState(false);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        app.auth().onIdTokenChanged((user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    setToken(token);
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setOwner(payload["owner"]);
                    //set current User AFTER token and isOwner
                    setCurrentUser(user);
                    setPending(false);
                    actions.updateAuth({ isOwner: payload["owner"], token });
                });
            } else {
                setCurrentUser(user);
                setPending(false);
            }
        });

        app.auth().onAuthStateChanged((user) => {
            // user.updateProfile({
            //   displayName: "Adam",
            // });
            if (user) {
                user.getIdToken().then((token) => {
                    setToken(token);
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setOwner(payload["owner"]);

                    //set current User AFTER token and isOwner
                    setCurrentUser(user);
                    setPending(false);
                    actions.updateAuth({ isOwner: payload["owner"], token });
                });
            } else {
                setCurrentUser(user);
                setPending(false);
            }
        });
    }, []);

    const register = async (name, email, password) => {
        await app.auth.createUserWithEmailAndPassword(email, password)
        return app.auth.currentUser.updateProfile({
            displayName: name
        })
    }

    if (pending) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                token,
                isOwner,
                pending,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    );
});

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}
