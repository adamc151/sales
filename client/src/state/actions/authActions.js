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

export function updateAuth({ isOwner, token }) {
  return async (dispatch, getState) => {
    dispatch({ type: "UPDATE_AUTH", payload: { isOwner, token } });
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


export function addUser() {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_USER_REQUEST", payload: null });

    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
        },
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
