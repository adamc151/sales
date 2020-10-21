import React, { useState, useCallback, useContext } from "react";
import styles from "./Login.module.css";
import { withRouter, Redirect } from "react-router";
import app from "../../firebase.js";
import { AuthContext } from "../../Auth";
import Image from "../Image/Image";

const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = useCallback(
    async (event, username, password) => {
      event.preventDefault();
      try {
        await app.auth().signInWithEmailAndPassword(username, password);
        // history.push("/home");
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
        <form onSubmit={(e) => handleLogin(e, username, password)} style={{ 'width': '100%' }}>
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

export default withRouter(Login);
