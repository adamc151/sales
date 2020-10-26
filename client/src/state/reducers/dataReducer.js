const initialState = {
  data: null,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_DATA":
      return {
        ...state,
        data: action.payload.data,
        date: action.payload.date,
        intervals: action.payload.intervals,
        intervalUnit: action.payload.intervalUnit,
        breakdowns: action.payload.breakdowns,
        saleBreakdowns: action.payload.saleBreakdowns,
        loading: false,
      };

    case "GET_ITEMS_REQUEST":
      return { ...state, getItemsLoading: true, error: false };
    case "GET_ITEMS_FAILED":
      return { ...state, getItemsLoading: false, error: true };
    case "GET_ITEMS_SUCCESS":
      return { ...state, getItemsLoading: false, items: action.payload };
    case "ADD_ITEM_REQUEST":
      return { ...state, addItemLoading: true, error: false };
    case "ADD_ITEM_FAILED":
      return { ...state, addItemLoading: false, error: true };
    case "ADD_ITEM_SUCCESS":
      return { ...state, addItemLoading: false };

    case "GET_TILLFLOAT_REQUEST":
      return { ...state, getTillFloatLoading: true, error: false };
    case "GET_TILLFLOAT_FAILED":
      return { ...state, getTillFloatLoading: false, error: true };
    case "GET_TILLFLOAT_SUCCESS":
      console.log("yooo action.payload", action.payload);
      return {
        ...state,
        getTillFloatLoading: false,
        tillFloat: action.payload,
      };
    case "ADD_TILLFLOAT_REQUEST":
      return { ...state, addTillFloatLoading: true, error: false };
    case "ADD_TILLFLOAT_FAILED":
      return { ...state, addTillFloatLoading: false, error: true };
    case "ADD_TILLFLOAT_SUCCESS":
      return { ...state, addTillFloatLoading: false };


    case "GET_TEAM_REQUEST":
      return { ...state, getTeamLoading: true, error: false };
    case "GET_TEAM_FAILED":
      return { ...state, getTeamLoading: false, error: true };
    case "GET_TEAM_SUCCESS":
      return { ...state, getTeamLoading: false, team: action.payload };
    default:
      return state;
  }
};

export default reducer;
