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
    default:
      return state;
  }
};

export default reducer;
