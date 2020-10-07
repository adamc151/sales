import React, { useState, useCallback, useContext } from "react";
import styles from "./Login.module.css";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router";
import app from "../../firebase.js";
import { AuthContext } from "../../Auth";
import { Button } from "../UI/Button";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = useCallback(
    async (event, username, password) => {
      event.preventDefault();
      try {
        await app.auth().signInWithEmailAndPassword(username, password);
        history.push("/today");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/today" />;
  }

  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <form onSubmit={(e) => handleLogin(e, username, password)}>
          <input
            className={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.signIn} type="submit">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     loading: state.auth.loading,
//     error: state.auth.error,
//     isAuthenticated: state.auth.token !== null,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   //   return {
//   //     onAuth: (email, password) => dispatch(actions.auth(email, password)),
//   //     onPasswordReset: (email) => dispatch(actions.resetPassword(email)),
//   //   };
//   return {};
// };

export default withRouter(Login);
