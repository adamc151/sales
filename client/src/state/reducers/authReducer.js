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
      console.log('yoooo action.payload[0]', action.payload);
      return { ...state, getUserLoading: false, ...action.payload };

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
