import moment from "moment";
import Swal from "sweetalert2";
import app from '../../components/Authentication/firebase';
import * as actions from "../../state/actions/authActions";

const error = (error, dispatch, cbFunction, cbArgs, newToken, onError = () => { }) => {

  if (error === 'Not Authorized') {
    if (dispatch && !newToken) {
      app.auth().currentUser.getIdToken(true).then(async (idToken) => {
        await dispatch(actions.updateAuth({ token: idToken }));
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

const generate1 = (items, date, interval = "day", team) => {
  const tempData = [];
  const tempItemsInRange = [];
  let acc = 0;
  let dayAcc = 0;
  let accBreakdowns = {
    CASH: { total: 0, percentage: 0 },
    CARD: { total: 0, percentage: 0 },
    AMEX: { total: 0, percentage: 0 },
    OTHER: { total: 0, percentage: 0 },
    VOUCHER: { total: 0, percentage: 0 },
    DAILY: { total: 0, percentage: 0 }
  };
  let accSaleBreakdowns = {
    lenses: { total: 0, percentage: 0, },
    accessories: { total: 0, percentage: 0 },
    fees: { total: 0, percentage: 0 },
  };
  let itemTypeBreakdowns = {
    SALE: { total: 0, tally: 0, percentage: 0 },
    REFUND: { total: 0, tally: 0, percentage: 0 },
    EXPENSE: { total: 0, tally: 0, percentage: 0 },
    VOUCHER: { total: 0, tally: 0, percentage: 0, breakdown: {} },
    DAILY: { total: 0, tally: 0, percentage: 0 }
  };
  let staffBreakdowns = team && team.length && team.reduce((acc, member) => {
    return { ...acc, [`${member.name}`]: { total: 0, tally: 0 } };
  }, {});
  let vouchersTotal = {
    pending: {},
    paid: {}
  }

  for (let i = 0; i < items.length; i++) {
    const currentDate = new Date(items[i].dateTime);
    const currentValue = 'value' in items[i] ? items[i].value : 0;
    let isDate = moment(currentDate).isSame(
      moment(date),
      interval === "week" ? "isoWeek" : interval
    );

    if (interval === 'year') {
      isDate = moment(currentDate).isBetween(moment(date), moment(date).add(1, 'years'), []);
    }

    const validPaymentMethod = items[i].paymentMethod === "CARD" || items[i].paymentMethod === "CASH" || items[i].paymentMethod === "AMEX" || !items[i].paymentMethod;
    const isPendingVoucher = items[i].type === 'VOUCHER' && items[i].paymentStatus === 'pending';

    if (items[i].type === 'VOUCHER') {
      const gos = items[i].voucherType.split(' - ')[0];
      if (gos && items[i].paymentStatus === 'pending') {
        if (vouchersTotal.pending[gos]) {
          vouchersTotal.pending[gos].total = Number((vouchersTotal.pending[gos].total + currentValue).toFixed(2));
        } else {
          vouchersTotal.pending[gos] = { total: Number(currentValue.toFixed(2)) };
        }
      } else if (gos && items[i].paymentStatus === 'paid') {
        if (vouchersTotal.paid[gos]) {
          vouchersTotal.paid[gos].total = Number((vouchersTotal.paid[gos].total + currentValue).toFixed(2));
        } else {
          vouchersTotal.paid[gos] = { total: Number(currentValue.toFixed(2)) };
        }
      }
    }

    if (isDate) {
      tempItemsInRange.push(items[i]);
    }

    if (isDate && validPaymentMethod && !isPendingVoucher) {
      if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {

        (accBreakdowns[items[i].paymentMethod] || accBreakdowns['OTHER']).total =
          (accBreakdowns[items[i].paymentMethod] || accBreakdowns['OTHER']).total -
          currentValue;

        if (items[i].type === 'REFUND') {
          itemTypeBreakdowns.REFUND.total = itemTypeBreakdowns.REFUND.total - currentValue;
          itemTypeBreakdowns.REFUND.tally++;
        } else if (items[i].type === 'EXPENSE') {
          itemTypeBreakdowns.EXPENSE.total = itemTypeBreakdowns.EXPENSE.total - currentValue;
          itemTypeBreakdowns.EXPENSE.tally++;
        }
      } else if (items[i].type === 'SALE') {
        (accBreakdowns[items[i].paymentMethod] || accBreakdowns['OTHER']).total = (accBreakdowns[items[i].paymentMethod] || accBreakdowns['OTHER']).total + currentValue;

        if (items[i].breakdown) {
          accSaleBreakdowns.lenses.total = accSaleBreakdowns.lenses.total + (items[i].breakdown.lenses || 0);
          accSaleBreakdowns.accessories.total = accSaleBreakdowns.accessories.total + (items[i].breakdown.accessories || 0);
          accSaleBreakdowns.fees.total = accSaleBreakdowns.fees.total + (items[i].breakdown.fees || 0);
        }

        itemTypeBreakdowns.SALE.total = itemTypeBreakdowns.SALE.total + currentValue;
        itemTypeBreakdowns.SALE.tally++;

        if (items[i].user) {
          staffBreakdowns[items[i].user].total = staffBreakdowns[items[i].user].total + currentValue;
          staffBreakdowns[items[i].user].tally++;
        }


      } else if (items[i].type === 'DAILY') {
        accBreakdowns['DAILY'].total = accBreakdowns['DAILY'].total + currentValue;
        itemTypeBreakdowns.DAILY.total = itemTypeBreakdowns.DAILY.total + currentValue;
        itemTypeBreakdowns.DAILY.tally++;
      } else if (items[i].type === 'VOUCHER') {
        const gos = items[i].voucherType.split(' - ')[0];
        accBreakdowns['VOUCHER'].total = accBreakdowns['VOUCHER'].total + currentValue;
        if (itemTypeBreakdowns['VOUCHER'].breakdown[gos]) {
          itemTypeBreakdowns['VOUCHER'].breakdown[gos].total = Number(itemTypeBreakdowns['VOUCHER'].breakdown[gos].total.toFixed(2)) + Number(currentValue.toFixed(2));
        } else {
          itemTypeBreakdowns['VOUCHER'].breakdown[gos] = { total: Number(currentValue.toFixed(2)) };
        }
        itemTypeBreakdowns.VOUCHER.total = itemTypeBreakdowns.VOUCHER.total + currentValue;
        itemTypeBreakdowns.VOUCHER.tally++;

      }
    }

    if (interval === "day" && isDate && validPaymentMethod && !isPendingVoucher) {

      let myValue;

      if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
        acc = acc - currentValue;
        myValue = currentValue * -1;
      } else {
        acc = acc + currentValue;
        myValue = currentValue
      }

      tempData.push({
        ...items[i],
        value: myValue,
        accumulative: Number(acc.toFixed(2)),
      });

    } else if (interval !== "day" && isDate && validPaymentMethod && !isPendingVoucher) {

      const previous =
        tempData.length && tempData[tempData.length - 1].dateTime;

      if (tempData.length && moment(currentDate).isSame(moment(previous), "day")) {

        if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
          dayAcc = dayAcc - currentValue;
          acc = acc - currentValue;

          console.log('yooo dayAcc', dayAcc);
          console.log('yooo acc', acc);
        } else {
          dayAcc = dayAcc + currentValue;
          acc = acc + currentValue;
        }

        tempData[tempData.length - 1].value = Number(dayAcc.toFixed(2));
        tempData[tempData.length - 1].accumulative = Number(acc.toFixed(2));

      } else {

        if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
          dayAcc = currentValue * -1;
        } else {
          dayAcc = currentValue;
        }

        if (acc === 0) {
          if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
            acc = currentValue * -1;
          } else {
            acc = currentValue
          }
        } else {
          if (items[i].type === 'EXPENSE' || items[i].type === 'REFUND') {
            acc = acc - currentValue
          } else {
            acc = acc + currentValue
          }

        }

        tempData.push({
          dateTime: currentDate,
          value: Number(dayAcc.toFixed(2)),
          accumulative: Number((acc).toFixed(2)),
        });
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

  Object.keys(itemTypeBreakdowns).map((key) => {
    if (itemTypeBreakdowns[key].total && tempData.length) {
      itemTypeBreakdowns[key].total = Number(itemTypeBreakdowns[key].total.toFixed(2));
    }
  });

  Object.keys(staffBreakdowns).map((key) => {
    if (staffBreakdowns[key].total && tempData.length) {
      staffBreakdowns[key].total = Number(staffBreakdowns[key].total.toFixed(2));
    }
  });

  const graphData = tempData.reduce((acc, item) => {
    return [...acc, { ...item, value: Math.abs(item.value), negative: item.value < 0 }];
  }, []);

  return { graphData, breakdowns: accBreakdowns, saleBreakdowns: accSaleBreakdowns, staffBreakdowns, itemsInRange: tempItemsInRange, itemTypeBreakdowns, vouchersTotal, graphData };
};

export function parseData(date, interval) {
  return async (dispatch, getState) => {
    if (!getState().data.items) {
      await dispatch(loadItems());
    }
    if (!getState().data.team) {
      await dispatch(getTeam());
    }
    const items = getState().data.items;
    const team = getState().data.team;

    if (!items) return null;

    const myDates = getDates(items, interval);
    const myDate = date || myDates[myDates.length - 1];
    const { graphData, breakdowns, saleBreakdowns, itemsInRange, itemTypeBreakdowns, staffBreakdowns, vouchersTotal } = generate1(items, myDate, interval, team);

    return dispatch({
      type: "CHANGE_DATA",
      payload: {
        graphData,
        breakdowns,
        saleBreakdowns,
        itemsInRange,
        itemTypeBreakdowns,
        staffBreakdowns,
        vouchersTotal,
        date: myDate,
        intervals: myDates,
        intervalUnit: interval,
      },
    });
  };
}

/***** Items *****/
export const loadItems = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_ITEMS_REQUEST", payload: null });

    if (!getState().data.team) {
      await dispatch(getTeam());
    }
    const team = getState().data.team;
    const teamMap = (team || []).reduce((acc, member) => {
      return { ...acc, [`${member.id}`]: member.name };
    }, {});

    try {
      const response = await fetch("/api/items", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        // const vouchers = [];
        const newItems = json.map((item) => {
          const withUser = { ...item, user: teamMap[item.user] || '' };
          // if (item.type === "VOUCHER") vouchers.push(withUser);
          return withUser;
        })

        dispatch({ type: "GET_ITEMS_SUCCESS", payload: { items: newItems } });
        return newItems;
      } else {
        console.log('yoooo error 1');
        error(json.error);
        dispatch({ type: "GET_ITEMS_FAILED", payload: null });
      }
    } catch (e) {
      console.log('yoooo error e', e);
      error(e);
      dispatch({ type: "GET_ITEMS_FAILED", payload: null });
    }
  };
};

export function postItem(item, newToken) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_ITEM_REQUEST", payload: null });

    const { _id, ...rest } = item;

    try {
      const response = await fetch("/api/additem", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": newToken || getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
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

export function updateItem(item, newToken) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_ITEM_REQUEST", payload: null });

    const { _id, ...rest } = item;

    try {
      const response = await fetch(`/api/editItem?item_id=${_id}`, {
        method: "PUT",
        headers: {
          "X-Firebase-ID-Token": newToken || getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      const json = await response.json();
      if (response.ok) {
        await dispatch(loadItems());
        dispatch({ type: "ADD_ITEM_SUCCESS", payload: null });
      } else {
        const onError = () => dispatch({ type: "ADD_ITEM_FAILED", payload: null });
        error(json.error, dispatch, updateItem, item, newToken, onError)
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


/***** Till Float *****/
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


/***** Team *****/
export const getTeam = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_TEAM_REQUEST", payload: null });

    try {
      const response = await fetch("/api/getTeam", {
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

export function addTeamMember(name, token) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_TEAM_MEMBER_REQUEST", payload: null });

    try {
      const response = await fetch("/api/addTeamMember", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": token || getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name })
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "ADD_TEAM_MEMBER_SUCCESS", payload: null });
      } else {
        error(json.error)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "ADD_TEAM_MEMBER_FAILED", payload: null });
    }
  };
}

export function deleteTeamMember(id, token) {
  return async (dispatch, getState) => {
    dispatch({ type: "DELETE_TEAM_MEMBER_REQUEST", payload: null });

    try {
      const response = await fetch(`/api/deleteTeamMember?id=${id}`, {
        method: "DELETE",
        headers: {
          "X-Firebase-ID-Token": token || getState().auth.token,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "DELETE_TEAM_MEMBER_SUCCESS", payload: null });
      } else {
        error(json.error)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "DELETE_TEAM_MEMBER_FAILED", payload: null });
    }
  };
}


/***** Notifications *****/
export const getNotifications = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_NOTIFICATIONS_REQUEST", payload: null });

    try {
      const response = await fetch("/api/notifications", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_NOTIFICATIONS_SUCCESS", payload: json });
        return json;
      } else {
        error(json.error);
        dispatch({ type: "GET_NOTIFICATIONS_FAILED", payload: null });
      }
    } catch (e) {
      error(e);
      dispatch({ type: "GET_NOTIFICATIONS_FAILED", payload: null });
    }
  };
};

export function postNotification(item, newToken) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_NOTIFICATION_REQUEST", payload: null });

    const { _id, ...rest } = item;

    try {
      const response = await fetch("/api/addNotification", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": newToken || getState().auth.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "ADD_NOTIFICATION_SUCCESS", payload: null });
      } else {
        const onError = () => dispatch({ type: "ADD_NOTIFICATION_FAILED", payload: null });
        error(json.error, dispatch, postItem, item, newToken, onError)
      }
      return response.ok;
    } catch (e) {
      error(e);
      dispatch({ type: "ADD_NOTIFICATION_FAILED", payload: null });
    }
  };
}

export function clearNotifications() {
  return async (dispatch, getState) => {
    dispatch({ type: "DELETE_NOTIFICATIONS_REQUEST", payload: null });

    try {
      const response = await fetch(`/api/clearNotifications`, {
        method: "DELETE",
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch({ type: "DELETE_NOTIFICATIONS_SUCCESS", payload: null });
      } else {
        dispatch({ type: "DELETE_NOTIFICATIONS_FAILED", payload: null });
        error(response.error);
      }
    } catch (e) {
      dispatch({ type: "DELETE_NOTIFICATIONS_FAILED", payload: null });
      error(e);
    }
  };
}





/***** Vouchers *****/
export const getVouchers = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_VOUCHERS_REQUEST", payload: null });

    try {
      const response = await fetch("/api/vouchers", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_VOUCHERS_SUCCESS", payload: json });
        return json;
      } else {
        error(json.error);
        dispatch({ type: "GET_VOUCHERS_FAILED", payload: null });
      }
    } catch (e) {
      error(e);
      dispatch({ type: "GET_VOUCHERS_FAILED", payload: null });
    }
  };
};



/***** Version *****/
export const getVersion = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_VERSION_REQUEST", payload: null });

    try {
      const response = await fetch("/api/vouchers", {
        headers: {
          "X-Firebase-ID-Token": getState().auth.token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_VERSION_SUCCESS", payload: json });
        return json;
      } else {
        error(json.error);
        dispatch({ type: "GET_VERSION_FAILED", payload: null });
      }
    } catch (e) {
      error(e);
      dispatch({ type: "GET_VERSION_FAILED", payload: null });
    }
  };
};