const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true };
    case "AUTH_SUCCESS":
      return { ...state, loading: false };
    case "AUTH_FAIL":
      return { ...state, loading: false, error: true };
    case "AUTH_LOGOUT":
      return state;
    case "PASSWORD_RESET":
      return { ...state };
    case "UPDATE_AUTH":
      console.log("yoooo UPDATE_AUTH", action);
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
