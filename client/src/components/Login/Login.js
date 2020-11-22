import React, { useState, useCallback, useContext } from "react";
import styles from "./Login.module.css";
import { withRouter, Redirect } from "react-router";
import app, { detachedApp } from "../Authentication/firebase.js";
import { AuthContext } from "../Authentication/Auth";
import Image from "../UI/Image";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/authActions";
import Loading from "../UI/Loading";
import { Switch, Route } from "react-router-dom";
import { Button } from '../UI/Button';
import Swal from "sweetalert2";
import { TermsAndConditions } from './TermsAndConditions';
import { PrivacyPolicy } from './PrivacyPolicy';


function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

const Login = ({ history, actions }) => {
  const { currentUser, setOwner, isOwner } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [redirect, setRedirect] = useState(true);

  const [shopName, setShopName] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [emailReset, setEmailReset] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [passwordRegisterConfirmation, setPasswordRegisterConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tcAccepted, setTcAccepted] = useState(false);

  const [inputErrors, setInputErrors] = useState([]);

  const handleLogin = useCallback(
    async (event, username, password) => {

      event.preventDefault();
      try {
        setRedirect(false);
        await app.auth().signInWithEmailAndPassword(username, password);

        setRedirect(true);

      } catch (error) {
        setRedirect(true);
        setErrorMessage(`${error}`);
      }
    },
    [history]
  );

  const handleRegister = useCallback(
    async (event, shopName, email, password) => {
      event.preventDefault();
      try {
        setRedirect(false);

        await detachedApp.auth().createUserWithEmailAndPassword(email, password);

        const idToken = await detachedApp.auth().currentUser.getIdToken();

        console.log('yooo idToken', idToken);

        //Add User to users db
        await actions.addUser({ shopName }, idToken);

        await app.auth().signInWithEmailAndPassword(email, password);

        // //Update isOwner in Auth Context
        // const userSummary = await actions.getUser();
        // setOwner(userSummary && userSummary.isOwner);
        setRedirect(true);

      } catch (error) {
        setRedirect(true);
        setErrorMessage(`${error}`);
      }
    },
    [history]
  );

  const handlePasswordReset = useCallback(
    async (event, email) => {
      event.preventDefault();
      try {
        setRedirect(false);
        await actions.resetPasswordUnauthenticated(process.env.REACT_APP_FIREBASE_KEY, email);
        setRedirect(true);
        Swal.fire({
          icon: "success",
          text: `If an account exists with that email, we have sent a reset link. Please check your emails to proceed`,
          showConfirmButton: true,
          allowOutsideClick: false,
        });
      } catch (error) {
        setRedirect(true);
        setErrorMessage(`${error}`);
      }
    },
    [history]
  );

  if (currentUser && redirect) {
    return isOwner ? <Redirect to="/dashboard" /> : <Redirect to="/add-item" />;
  }

  const policyWrapper = window.location.pathname === "/termsandconditions" || window.location.pathname === "/privacypolicy";

  console.log('yooo inputErrors', inputErrors);

  return (
    <div className={styles.background}>
      <Image className={styles.mobileImage} src={"/images/splash3_1.png"} />
      <Image className={styles.desktopImage} src={"/images/desktopsplash2.jpg"} />
      <div className={`${styles.wrapper} ${policyWrapper ? styles.policyWrapper : ''}`}>

        <Switch>
          <Route path="/login" render={() => {
            return <form
              onSubmit={(e) => {
                if (username && password) {
                  handleLogin(e, username, password);
                } else {
                  const inputErrors = [];
                  !username && inputErrors.push('username');
                  !password && inputErrors.push('password');
                  setInputErrors(inputErrors);
                  e.preventDefault();
                }
              }}
              style={{ 'width': '100%' }}>
              <div className={styles.appName}>Venti.app</div>
              <div className={styles.tagline}>your sales in twenty-twenty</div>
              <input
                className={`${styles.input} ${inputErrors.includes('username') ? styles.inputError : ''}`}
                type="text"
                placeholder="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className={`${styles.input} ${inputErrors.includes('password') ? styles.inputError : ''}`}
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
              <Button className={styles.signIn} type="submit" isLoading={!redirect}>
                Sign In
              </Button>

              <a className={styles.signUp} onClick={() => { setErrorMessage(""); history.push('/signup'); }}>
                Sign Up
              </a>
              <a className={styles.signUp} onClick={() => { setErrorMessage(""); history.push('/reset-password'); }}>
                Forgotten Password?
              </a>
            </form>
          }} />

          <Route path="/signup" render={() => {
            return <form
              onSubmit={(e) => {
                if (shopName && emailRegister && passwordRegister && tcAccepted) {
                  handleRegister(e, shopName, emailRegister, passwordRegister)
                } else {
                  const inputErrors = [];
                  !shopName && inputErrors.push('shopName');
                  !emailRegister && inputErrors.push('emailRegister');
                  !passwordRegister && inputErrors.push('passwordRegister');
                  !tcAccepted && inputErrors.push('tcAccepted');

                  setInputErrors(inputErrors);
                  e.preventDefault();
                }

              }}
              style={{ 'width': '100%' }}>

              <div className={styles.register}>Register</div>
              <div className={styles.sectionText}>Enter your branch/shop username:</div>
              <input
                className={`${styles.input} ${inputErrors.includes('shopName') ? styles.inputError : ''}`}
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
              <div className={styles.sectionText}>Please enter your email address:</div>
              <input
                className={`${styles.input} ${inputErrors.includes('emailRegister') ? styles.inputError : ''}`}
                type="text"
                value={emailRegister}
                onChange={(e) => setEmailRegister(e.target.value)}
              />
              <div className={styles.sectionText}>Choose a password:</div>
              <input
                className={`${styles.input} ${inputErrors.includes('passwordRegister') ? styles.inputError : ''}`}
                type="password"
                value={passwordRegister}
                onChange={(e) => setPasswordRegister(e.target.value)}
              />
              <div className={styles.termsAndConditionsWrapper}>
                <div className={styles.acceptTextWrapper}>
                  {"I agree to the "}
                  <a className={styles.termsAndConditionsLink} onClick={() => openInNewTab('/termsandconditions')}>Terms and Conditions</a>
                  {" and "}
                  <a className={styles.termsAndConditionsLink} onClick={() => openInNewTab('/privacypolicy')}>Privacy Policy</a>
                </div>
                <div className={`${!tcAccepted && inputErrors.includes('tcAccepted') ? styles.tcInputError : ''}`}>
                  <input
                    className={`${styles.termsAndConditionsCheckbox}`}
                    type="checkbox"
                    value={tcAccepted}
                    onChange={(e) => setTcAccepted(e.target.checked)}
                  />
                </div>
              </div>
              {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
              <Button className={styles.signIn} type="submit" isLoading={!redirect}>
                Sign Up
              </Button>

              <a className={styles.signUp} onClick={() => {
                setInputErrors([]);
                setErrorMessage("");
                history.push('/login');
              }}>
                Sign In
          </a>
            </form>
          }} />

          <Route path="/reset-password" render={() => {
            return <form onSubmit={(e) => handlePasswordReset(e, emailReset)} style={{ 'width': '100%' }}>
              <div className={styles.sectionText}>Please enter your email address:</div>
              <input
                className={styles.input}
                type="text"
                value={emailReset}
                onChange={(e) => setEmailReset(e.target.value)}
              />
              {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
              <Button className={styles.signIn} type="submit" isLoading={!redirect}>
                Reset Password
              </Button>

              <a className={styles.signUp} onClick={() => {
                setInputErrors([]);
                setErrorMessage("");
                history.push('/login');
              }}
              >
                Sign In
              </a>
            </form>
          }} />


          <Route path="/termsandconditions" render={() => {
            return <TermsAndConditions />
          }} />

          <Route path="/privacypolicy" render={() => {
            return <PrivacyPolicy />
          }} />

        </Switch>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
