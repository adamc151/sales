import Swal from "sweetalert2";
import app from '../../components/Authentication/firebase';

const error = (error, dispatch, cbFunction, cbArgs, newToken, onError = () => { }) => {

  if (error === 'Not Authorized') {
    if (dispatch && !newToken) {
      app.auth().currentUser.getIdToken(true).then(function (idToken) {
        dispatch(cbFunction(cbArgs, idToken));
      });
    } else {
      onError()
      Swal.fire({
        icon: "error",
        text: "Your session may have expired! Refresh the page and try again",
        showConfirmButton: true,
        confirmButtonText: "Refresh",
        showCancelButton: true,
        cancelButtonText: "Close"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        } else if (result.isDenied) {
          Swal.close();
        }
      });
    }
  } else {
    onError();
    Swal.fire({
      icon: "error",
      text: error || "Something went wrong!",
      timer: 1000,
      showConfirmButton: false,
    });
  }
};

export function updateAuth({ isOwner, token, displayName, staffAccounts }) {
  return async (dispatch, getState) => {
    dispatch({ type: "UPDATE_AUTH", payload: { isOwner, token, displayName, staffAccounts } });
  };
}

export const getUser = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_USER_REQUEST", payload: null });

    try {
      const response = await fetch("/api/user", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_USER_SUCCESS", payload: json });
        return json;
      } else {
        // error(json.error);
        dispatch({ type: "GET_USER_FAILED", payload: null });
        throw json.error;
      }
    } catch (e) {
      console.log('yoooo error e', e);
      // error(e);
      dispatch({ type: "GET_USER_FAILED", payload: null });
      throw e;
    }
  };
};


export function addUser(args) {
  const { isStaffAccount, email, shopName } = args || {};
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_USER_REQUEST", payload: null });

    try {
      const response = await fetch(isStaffAccount ? "/api/addStaffUser" : "/api/addUser", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, shopName })
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "ADD_USER_SUCCESS", payload: null });
      } else {
        error(json.error)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "ADD_USER_FAILED", payload: null });
    }
  };
}

export function resetPassword(apiKey) {
  return async (dispatch, getState) => {
    dispatch({ type: "RESET_PASSWORD_REQUEST", payload: null });
    try {
      const response = await fetch("/api/resetPassword", {
        method: "GET",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
          "API-KEY": apiKey,
        },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: null });
      } else {
        error(json.error)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "RESET_PASSWORD_FAILED", payload: null });
    }
  };
}

export function resetPasswordUnauthenticated(apiKey, email) {
  return async (dispatch, getState) => {
    dispatch({ type: "RESET_PASSWORD_REQUEST_UNAUTH", payload: null });

    const authData = {
      requestType: "PASSWORD_RESET",
      email: email,
    };
    let url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + apiKey;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: authData && JSON.stringify(authData),
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "RESET_PASSWORD_SUCCESS_UNAUTH", payload: null });
      } else {
        dispatch({ type: "RESET_PASSWORD_FAILED_UNAUTH", payload: null });
      }
      return response.ok;
    } catch (e) {
      dispatch({ type: "RESET_PASSWORD_FAILED_UNAUTH", payload: null });
    }
  };
}

export function changeShopName({ shopName }) {
  return async (dispatch, getState) => {
    dispatch({ type: "CHANGE_SHOPNAME_REQUEST", payload: null });

    try {
      const response = await fetch("/api/changeShopName", {
        method: "PUT",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
        },
        body: shopName && JSON.stringify({ shopName })
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "CHANGE_SHOPNAME_SUCCESS", payload: json });
        dispatch(getUser());
      } else {
        throw new Error("ADD_TILLFLOAT_FAILED");
      }
    } catch (e) {
      dispatch({ type: "CHANGE_SHOPNAME_FAILED", payload: null });
      throw new Error("ADD_TILLFLOAT_FAILED");
    }
  };
}
