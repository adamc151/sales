import moment from "moment";
import { toast } from "react-toastify";

const getDates = (items, unit) => {
  const temp = [];
  let previous = "";
  items.map((item, i) => {
    const isSame = moment(new Date(item.dateTime)).isSame(
      moment(new Date(previous)),
      unit
    );

    if (i === 0) {
      const momentDate1 = moment(item.dateTime);
      temp.push(
        momentDate1.startOf(unit === "week" ? "isoWeek" : unit).toISOString()
      );
    } else if (!isSame) {
      const momentDate2 = moment(item.dateTime);
      if (unit === "day") {
        temp.push(momentDate2.toISOString());
      } else {
        temp.push(
          momentDate2.startOf(unit === "week" ? "isoWeek" : unit).toISOString()
        );
      }
    }

    previous = item.dateTime;
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

  for (let i = 0; i < items.length; i++) {
    const currentDate = new Date(items[i].dateTime);
    const isDate = moment(currentDate).isSame(
      moment(date),
      interval === "week" ? "isoWeek" : interval
    );

    if (isDate && items[i].paymentMethod !== "OTHER") {
      if (items[i].isExpense) {
        accBreakdowns[items[i].paymentMethod || "CASH"].total =
          accBreakdowns[items[i].paymentMethod || "CASH"].total -
          items[i].value;
      } else {
        accBreakdowns[items[i].paymentMethod || "CASH"].total =
          accBreakdowns[items[i].paymentMethod || "CASH"].total +
          items[i].value;
      }
    }

    if (interval === "day" && isDate) {
      if (items[i].isExpense) {
        acc = acc - items[i].value;
      } else {
        acc = acc + items[i].value;
      }

      tempData.push({
        ...items[i],
        accumulative: acc,
      });
    } else if (interval !== "day" && isDate) {
      const previous =
        tempData.length && tempData[tempData.length - 1].dateTime;
      if (
        tempData.length &&
        moment(currentDate).isSame(moment(previous), "day")
      ) {
        if (items[i].isExpense) {
          dayAcc = dayAcc - items[i].value;
          acc = acc - items[i].value;
        } else {
          dayAcc = dayAcc + items[i].value;
          acc = acc + items[i].value;
        }
        tempData[tempData.length - 1].value = dayAcc;
        tempData[tempData.length - 1].accumulative = acc;
      } else {
        tempData.push({
          dateTime: currentDate,
          value: items[i].value,
          accumulative: items[i].value,
        });
        dayAcc = 0;
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
    }
  });

  return { data: tempData, breakdowns: accBreakdowns };
};

export function parseData(date, interval, token) {
  return async (dispatch, getState) => {
    if (!getState().data.items) {
      await dispatch(loadItems(token));
    }
    const items = getState().data.items;
    const myDates = getDates(items, interval);
    const myDate = date || myDates[myDates.length - 1];

    const { data, breakdowns } = generate1(items, myDate, interval);

    return dispatch({
      type: "CHANGE_DATA",
      payload: {
        data,
        breakdowns,
        date: myDate,
        intervals: myDates,
        intervalUnit: interval,
      },
    });
  };
}

export const loadItems = (token) => {
  return async (dispatch, getState) => {
    dispatch({ type: "GET_ITEMS_REQUEST", payload: null });

    try {
      const response = await fetch("/api/items", {
        headers: {
          "X-Firebase-ID-Token": token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_ITEMS_SUCCESS", payload: json });
        return json;
      } else {
        dispatch({ type: "GET_ITEMS_FAILED", payload: null });
      }
    } catch (e) {
      dispatch({ type: "GET_ITEMS_FAILED", payload: null });
    }
  };
};

export function postItem(item, token) {
  return async (dispatch, getState) => {
    dispatch({ type: "ADD_ITEM_REQUEST", payload: null });

    try {
      const response = await fetch("/api/additem", {
        method: "POST",
        headers: {
          "X-Firebase-ID-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      console.log("yooo response", response);
      if (response.ok) {
        await dispatch(loadItems(token));

        toast.success("Item added successfully");
        dispatch({ type: "ADD_ITEM_SUCCESS", payload: null });
      } else {
        toast.warn("Failed");
        dispatch({ type: "ADD_ITEM_FAILED", payload: null });
      }
      return response.ok;
    } catch (e) {
      toast.warn("An error occurred. Please try again.");
      dispatch({ type: "ADD_ITEM_FAILED", payload: null });
    }
  };
}

export function deleteItem(itemId, token) {
  return async (dispatch, getState) => {
    dispatch({ type: "DELETE_ITEM_REQUEST", payload: null });

    try {
      const response = await fetch(`/api/removeitem?id=${itemId}`, {
        method: "DELETE",
        headers: {
          "X-Firebase-ID-Token": token,
          "Content-Type": "application/json",
        },
      });
      console.log("yooo response", response);
      if (response.ok) {
        dispatch({ type: "DELETE_ITEM_SUCCESS", payload: null });
      } else {
        dispatch({ type: "DELETE_ITEM_FAILED", payload: null });
      }
    } catch (e) {
      dispatch({ type: "DELETE_ITEM_FAILED", payload: null });
    }
  };
}
