const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_AUTH":
      return { ...state, ...action.payload };

    case "ADD_USER_REQUEST":
      return { ...state, addUserLoading: true, error: false };
    case "ADD_USER_FAILED":
      return { ...state, addUserLoading: false, error: true };
    case "ADD_USER_SUCCESS":
      return { ...state, addUserLoading: false };
    default:
      return state;
  }
};

export default reducer;
