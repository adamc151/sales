import React, { useState, useCallback, useContext } from "react";
import styles from "./Login.module.css";
import { withRouter, Redirect } from "react-router";
import app from "../Authentication/firebase.js";
import { AuthContext } from "../Authentication/Auth";
import Image from "../UI/Image";
import { Switch, Route } from "react-router-dom";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRegisterConfirmation, setPasswordRegisterConfirmation] = useState("");

  const handleLogin = useCallback(
    async (event, username, password) => {
      event.preventDefault();
      try {
        await app.auth().signInWithEmailAndPassword(username, password);
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const handleRegister = useCallback(
    async (event, email, password) => {
      event.preventDefault();
      try {
        await app.auth().createUserWithEmailAndPassword(email, password);
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <div className={styles.background}>
      <Image className={styles.mobileImage} src={"/images/splash3_1.png"} />
      <Image className={styles.desktopImage} src={"/images/desktopsplash2.jpg"} />
      <div className={styles.wrapper}>

        <Switch>
          <Route path="/login" render={() => {
            return <form onSubmit={(e) => handleLogin(e, username, password)} style={{ 'width': '100%' }}>
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

              <a className={styles.signUp} onClick={() => { history.push('/signup'); }}>
                Sign Up
          </a>
            </form>
          }} />

          <Route path="/signup" render={() => {
            return <form onSubmit={(e) => handleRegister(e, emailRegister, passwordRegister)} style={{ 'width': '100%' }}>
              <div className={styles.register}>Register</div>
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
              {/* <div className={styles.sectionText}>Please confirm your password:</div>
              <input
                className={styles.input}
                type="password"
                value={passwordRegisterConfirmation}
                onChange={(e) => setPasswordRegisterConfirmation(e.target.value)}
              /> */}
              <button className={styles.signIn} type="submit">
                Sign Up
          </button>

              <a className={styles.signUp} onClick={() => { history.push('/login'); }}>
                Sign In
          </a>
            </form>
          }} />

        </Switch>
      </div>
    </div>
  );
};

export default withRouter(Login);
