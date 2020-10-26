import moment from "moment";
import Swal from "sweetalert2";
import app from '../../firebase';

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


//TAX YEAR DATES 6th April – 5th April

const getDates = (items, unit) => {
  const temp = [];
  let previous = "";

  //moment('2010-10-20').isBetween('2010-10-19', '2010-10-25'); // true
  //if(moment(item.dateTime) is before 6th April) ...get previous year 5th April
  //if(moment(item.dateTime) is 6th April or after) ...get current year 6th April

  if (unit === 'year') {
    items.map((item, i) => {
      const currentYear = moment(item.dateTime).format('YYYY');
      const april6 = `04/06/${currentYear}`;
      const april6Date = new Date(april6);
      const isBefore = moment(item.dateTime).isBefore(april6Date);
      let momentDate3 = moment(april6Date).toISOString();

      if (isBefore) {
        const prevApril6 = `04/06/${currentYear - 1}`;
        const prevApril6Date = new Date(prevApril6);
        momentDate3 = moment(prevApril6Date).toISOString();
      }

      if (temp.length === 0) {
        temp.push(momentDate3);
      } else if (temp[temp.length - 1] !== momentDate3) {
        temp.push(momentDate3);
      }

      previous = item.dateTime;
      return;
    });
    return temp;
  }


  items.map((item, i) => {

    if (i === 0) {
      const momentDate1 = moment(item.dateTime);
      temp.push(
        momentDate1.startOf(unit === "week" ? "isoWeek" : unit).toISOString()
      );
    } else {

      const isSame = moment(new Date(item.dateTime)).isSame(
        moment(new Date(previous)),
        unit === 'week' ? 'isoWeek' : unit
      );

      if (!isSame) {

        const momentDate2 = moment(item.dateTime);
        if (unit === "day") {
          temp.push(momentDate2.toISOString());
        } else {
          temp.push(
            momentDate2.startOf(unit === "week" ? "isoWeek" : unit).toISOString()
          );
        }
      }

    }

    previous = item.dateTime;
    return;
  });
  return temp;
};

const generate1 = (items, date, interval = "day") => {
  const tempData = [];
  let acc = 0;
  let dayAcc = 0;
  let accBreakdowns = {
    CASH: {
      total: 0,
      percentage: 0,
    },
    CARD: { total: 0, percentage: 0 },
    AMEX: { total: 0, percentage: 0 },
  };
  let accSaleBreakdowns = {
    lenses: {
      total: 0,
      percentage: 0,
    },
    accessories: { total: 0, percentage: 0 },
    fees: { total: 0, percentage: 0 },
  };

  for (let i = 0; i < items.length; i++) {
    const currentDate = new Date(items[i].dateTime);
    let isDate = moment(currentDate).isSame(
      moment(date),
      interval === "week" ? "isoWeek" : interval
    );

    if (interval === 'year') {
      isDate = moment(currentDate).isBetween(moment(date), moment(date).add(1, 'years'), []);
    }

    const validPaymentMethod = items[i].paymentMethod === "CARD" || items[i].paymentMethod === "CASH" || items[i].paymentMethod === "AMEX" || !items[i].paymentMethod;

    if (isDate && validPaymentMethod) {
      if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
        accBreakdowns[items[i].paymentMethod || "CASH"].total =
          accBreakdowns[items[i].paymentMethod || "CASH"].total -
          items[i].value;
      } else {
        accBreakdowns[items[i].paymentMethod || "CASH"].total =
          accBreakdowns[items[i].paymentMethod || "CASH"].total +
          items[i].value;

        if (items[i].breakdown) {
          accSaleBreakdowns.lenses.total = accSaleBreakdowns.lenses.total + (items[i].breakdown.lenses || 0);
          accSaleBreakdowns.accessories.total = accSaleBreakdowns.accessories.total + (items[i].breakdown.accessories || 0);
          accSaleBreakdowns.fees.total = accSaleBreakdowns.fees.total + (items[i].breakdown.fees || 0);
        }
      }
    }

    if (interval === "day" && isDate && validPaymentMethod) {
      if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
        acc = acc - items[i].value;
      } else {
        acc = acc + items[i].value;
      }

      tempData.push({
        ...items[i],
        accumulative: Number(acc.toFixed(2)),
      });
    } else if (interval !== "day" && isDate && validPaymentMethod) {

      const previous =
        tempData.length && tempData[tempData.length - 1].dateTime;

      if (tempData.length && moment(currentDate).isSame(moment(previous), "day")) {

        if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
          dayAcc = dayAcc - items[i].value;
          acc = acc - items[i].value;
        } else {
          dayAcc = dayAcc + items[i].value;
          acc = acc + items[i].value;
        }

        tempData[tempData.length - 1].value = Number(dayAcc.toFixed(2));
        tempData[tempData.length - 1].accumulative = Number(acc.toFixed(2));

      } else {
        tempData.push({
          dateTime: currentDate,
          value: items[i].value,
          accumulative: Number((acc + items[i].value).toFixed(2)),
        });

        if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
          dayAcc = items[i].value * -1;
        } else {
          dayAcc = items[i].value;
        }


        if (acc === 0) {
          if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
            acc = items[i].value * -1;
          } else {
            acc = items[i].value
          }
        } else {
          if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
            acc = acc - items[i].value
          } else {
            acc = acc + items[i].value
          }

        }
      }
    }
  }

  Object.keys(accBreakdowns).map((key) => {
    if (accBreakdowns[key].total && tempData.length) {
      accBreakdowns[key].percentage = (
        (accBreakdowns[key].total /
          tempData[tempData.length - 1].accumulative) *
        100
      ).toFixed(2);

      accBreakdowns[key].total = Number(accBreakdowns[key].total.toFixed(2));
    }
  });
  Object.keys(accSaleBreakdowns).map((key) => {
    if (accSaleBreakdowns[key].total && tempData.length) {
      accSaleBreakdowns[key].total = Number(accSaleBreakdowns[key].total.toFixed(2));
    }
  });

  return { data: tempData, breakdowns: accBreakdowns, saleBreakdowns: accSaleBreakdowns };
};

export function parseData(date, interval) {
  return async (dispatch, getState) => {
    if (!getState().data.items) {
      await dispatch(loadItems());
    }
    const items = getState().data.items;

    if (!items) return null;

    const myDates = getDates(items, interval);
    const myDate = date || myDates[myDates.length - 1];

    const { data, breakdowns, saleBreakdowns } = generate1(items, myDate, interval);

    return dispatch({
      type: "CHANGE_DATA",
      payload: {
        data,
        breakdowns,
        saleBreakdowns,
        date: myDate,
        intervals: myDates,
        intervalUnit: interval,
      },
    });
  };
}

export const loadItems = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_ITEMS_REQUEST", payload: null });

    try {
      const response = await fetch("/api/items", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_ITEMS_SUCCESS", payload: json });
        return json;
      } else {
        error(json.error);
        dispatch({ type: "GET_ITEMS_FAILED", payload: null });
      }
    } catch (e) {
      error(e);
      dispatch({ type: "GET_ITEMS_FAILED", payload: null });
    }
  };
};

export function postItem(item, newToken) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_ITEM_REQUEST", payload: null });

    try {
      const response = await fetch("/api/additem", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": newToken || getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      const json = await response.json();
      if (response.ok) {
        await dispatch(loadItems());
        dispatch({ type: "ADD_ITEM_SUCCESS", payload: null });
      } else {
        const onError = () => dispatch({ type: "ADD_ITEM_FAILED", payload: null });
        error(json.error, dispatch, postItem, item, newToken, onError)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "ADD_ITEM_FAILED", payload: null });
    }
  };
}

export function deleteItem(itemId) {
  return async (dispatch, getState) => {
    dispatch({ type: "DELETE_ITEM_REQUEST", payload: null });

    try {
      const response = await fetch(`/api/removeitem?id=${itemId}`, {
        method: "DELETE",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch({ type: "DELETE_ITEM_SUCCESS", payload: null });
      } else {
        dispatch({ type: "DELETE_ITEM_FAILED", payload: null });
        throw new Error("DELETE_ITEM_FAILED");
      }
    } catch (e) {
      dispatch({ type: "DELETE_ITEM_FAILED", payload: null });
      throw new Error("DELETE_ITEM_FAILED");
    }
  };
}

export const getTillFloat = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_TILLFLOAT_REQUEST", payload: null });

    try {
      const response = await fetch("/api/tillfloat", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        const { value, dateTime } = json[0];
        const isSame = moment(new Date(dateTime)).isSame(
          moment(new Date()),
          'isoWeek'
        );
        dispatch({ type: "GET_TILLFLOAT_SUCCESS", payload: isSame ? value : 0 });
        return json;
      } else {
        dispatch({ type: "GET_TILLFLOAT_FAILED", payload: null });
      }
    } catch (e) {
      dispatch({ type: "GET_TILLFLOAT_FAILED", payload: null });
    }
  };
};

export function postTillFloat(value) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_TILLFLOAT_REQUEST", payload: null });

    const now = new Date();
    const dateTime = now.toISOString();

    try {
      const response = await fetch("/api/tillfloat", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value, dateTime }),
      });
      if (response.ok) {
        await dispatch(getTillFloat());
        dispatch({ type: "ADD_TILLFLOAT_SUCCESS", payload: null });
      } else {
        dispatch({ type: "ADD_TILLFLOAT_FAILED", payload: null });
        throw new Error("ADD_TILLFLOAT_FAILED");
      }
    } catch (e) {
      dispatch({ type: "ADD_TILLFLOAT_FAILED", payload: null });
      throw new Error("ADD_TILLFLOAT_FAILED");
    }
  };
}


export function postItems(items, newToken) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_ITEM_REQUEST", payload: null });

    try {
      const response = await fetch("/api/additems", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": newToken || getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });
      const json = await response.json();
      if (response.ok) {
        await dispatch(loadItems());
        dispatch({ type: "ADD_ITEM_SUCCESS", payload: null });
      } else {
        const onError = () => dispatch({ type: "ADD_ITEM_FAILED", payload: null });
        error(json.error, dispatch, postItem, items, newToken, onError)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "ADD_ITEM_FAILED", payload: null });
    }
  };
}

export const getTeam = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_TEAM_REQUEST", payload: null });

    try {
      const response = await fetch("/api/team", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_TEAM_SUCCESS", payload: json });
        return json;
      } else {
        error(json.error);
        dispatch({ type: "GET_TEAM_FAILED", payload: null });
      }
    } catch (e) {
      error(e);
      dispatch({ type: "GET_TEAM_FAILED", payload: null });
    }
  };
};