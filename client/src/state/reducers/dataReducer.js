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
        itemsInRange: action.payload.itemsInRange,
        itemTypeBreakdowns: action.payload.itemTypeBreakdowns,
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


    case "GET_VOUCHERS_REQUEST":
      return { ...state, getVouchersLoading: true, error: false };
    case "GET_VOUCHERS_FAILED":
      return { ...state, getVouchersLoading: false, error: true };
    case "GET_VOUCHERS_SUCCESS":
      return { ...state, getVouchersLoading: false, vouchers: action.payload };


    case "GET_VERSION_REQUEST":
      return { ...state, getVouchersLoading: true, error: false };
    case "GET_VERSION_FAILED":
      return { ...state, getVouchersLoading: false, error: true };
    case "GET_VERSION_SUCCESS":
      return { ...state, getVouchersLoading: false, version: action.payload };


    case "GET_NOTIFICATIONS_REQUEST":
      return { ...state, getNotifictionsLoading: true, error: false };
    case "GET_NOTIFICATIONS_FAILED":
      return { ...state, getNotifictionsLoading: false, error: true };
    case "GET_NOTIFICATIONS_SUCCESS":
      return { ...state, getNotifictionsLoading: false, notifications: action.payload };
    case "ADD_NOTIFICATION_REQUEST":
      return { ...state, addNotificationLoading: true, error: false };
    case "ADD_NOTIFICATION_FAILED":
      return { ...state, addNotificationLoading: false, error: true };
    case "ADD_NOTIFICATION_SUCCESS":
      return { ...state, addNotificationLoading: false };

    default:
      return state;
  }
};

export default reducer;
