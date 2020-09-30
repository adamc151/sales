export function updateAuth({ isOwner, token }) {
  return async (dispatch, getState) => {
    dispatch({ type: "UPDATE_AUTH", payload: { isOwner, token } });
  };
}
