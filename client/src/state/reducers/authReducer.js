const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_AUTH":
      console.log('yoooo UPDATE_AUTH payload', action.payload);
      return { ...state, ...action.payload };

    case "GET_USER_REQUEST":
      return { ...state, getUserLoading: true, error: false };
    case "GET_USER_FAILED":
      return { ...state, getUserLoading: false, error: true };
    case "GET_USER_SUCCESS":
      return { ...state, getUserLoading: false, ...action.payload };

    case "RESET_PASSWORD_REQUEST":
      return { ...state, error: false };
    case "RESET_PASSWORD_FAILED":
      return { ...state, error: true };
    case "RESET_PASSWORD_SUCCESS":
      return { ...state };
    case "RESET_PASSWORD_REQUEST_UNAUTH":
      return { ...state, error: false };
    case "RESET_PASSWORD_FAILED_UNAUTH":
      return { ...state, error: true };
    case "RESET_PASSWORD_SUCCESS_UNAUTH":
      return { ...state };

    case "ADD_USER_REQUEST":
      return { ...state, addUserLoading: true, error: false };
    case "ADD_USER_FAILED":
      return { ...state, addUserLoading: false, error: true };
    case "ADD_USER_SUCCESS":
      return { ...state, addUserLoading: false };

    case "CHANGE_SHOPNAME_REQUEST":
      return { ...state, changeShopNameLoading: true, error: false };
    case "CHANGE_SHOPNAME_FAILED":
      return { ...state, changeShopNameLoading: false, error: true };
    case "CHANGE_SHOPNAME_SUCCESS":
      return { ...state, changeShopNameLoading: false, ...action.payload };

    default:
      return state;
  }
};

export default reducer;
