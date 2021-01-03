import Swal from "sweetalert2";
import moment from "moment";
import { saveAs } from 'file-saver';

export const getGreeting = () => {
  var hr = new Date().getHours();
  let greeting = "";
  var data = [
    [0, 4, "Good Morning"], // join these two?
    [5, 11, "Good Morning"], // join these two?
    [12, 17, "Good Afternoon"],
    [18, 24, "Good Evening"],
  ];

  for (var i = 0; i < data.length; i++) {
    if (hr >= data[i][0] && hr <= data[i][1]) {
      greeting = data[i][2];
    }
  }

  return greeting;
};

export const getDateLabel = (date, intervalUnit) => {
  switch (intervalUnit) {
    case "day":
      return `${moment(date).format("ddd D MMM YY")}`;
    case "week":
      return `${moment(date)
        .startOf("isoWeek")
        .format("D MMM YY")} - ${moment(date)
          .endOf("isoWeek")
          .format("D MMM YY")}`;
    case "month":
      return `${moment(date).format("MMMM Y")}`;
    case "year":
      return `${moment(date).format("Y")}/${moment(date).add(1, 'years').format("YY")}`;
  }
}

export const tillFloatPopup = (value, action) => {
  Swal.queue([
    {
      text: "Please enter till float amount (£):",
      input: "text",
      inputValue: value,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: (tillFloat) => {
        if (Number(tillFloat) === value) {
          Swal.close();
        } else {
          return action(Number(tillFloat))
            .then((data) => {
              Swal.insertQueueStep({
                icon: "success",
                title: `£${tillFloat}`,
                text: "Till float updated successfully",
                timer: 2000,
                showConfirmButton: false,
                showClass: {
                  popup: "",
                },
                allowOutsideClick: false,
              });
            })
            .catch(() => {
              Swal.showValidationMessage(`Something went wrong`);
            });
        }

      },
    },
  ]);
};



export const exportData = (props) => {
  Swal.fire({
    title: `${getDateLabel(props.data.date, props.data.intervalUnit)}`,
    text: 'Select format to download:',
    showDenyButton: true,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: `JSON`,
    denyButtonText: `CSV`,
    cancelButtonText: `Close`,
  }).then((result) => {
    if (result.isConfirmed) {
      const blob = new Blob([JSON.stringify(props.data.itemsInRange)], { type: 'application/json' });
      saveAs(blob, `${getDateLabel(props.data.date, props.data.intervalUnit)}.json`);
    } else if (result.isDenied) {
      let csv = `date,details,type,payment method,lenses,accessories,fees,total,,date,card total,cash total,amex total,${props.data.intervalUnit} total\r\n`;
      props.data.itemsInRange.map((item, i) => {
        const value = item.type === 'REFUND' || item.type === 'EXPENSE' ? item.value * -1 : item.value;
        const { breakdown = {}, dateTime, type = '', paymentMethod, details } = item;
        const { lenses = 0, accessories = 0, fees = 0 } = breakdown;
        let myDate = moment(new Date(dateTime)).format("L");
        const splitDate = myDate.split('/');

        myDate = `${splitDate[1]}/${splitDate[0]}/${splitDate[2]}`;
        csv = csv + `${myDate},"${details || ''}",${type},${paymentMethod || ""},${lenses},${accessories},${fees},${value}`

        if (i === 0) {
          const cardTotal = `${props.data.breakdowns.CARD.total >= 0 ? '' : '- '} ${Math.abs(props.data.breakdowns.CARD.total)}`;
          const cashTotal = `${props.data.breakdowns.CASH.total >= 0 ? '' : '- '} ${Math.abs(props.data.breakdowns.CASH.total)}`;
          const amexTotal = `${props.data.breakdowns.AMEX.total >= 0 ? '' : '- '} ${Math.abs(props.data.breakdowns.AMEX.total)}`;
          const dayTotal = props.data.graphData[props.data.graphData.length - 1].accumulative;

          csv = csv + `,,${getDateLabel(props.data.date, props.data.intervalUnit)},${cardTotal},${cashTotal},${amexTotal},${dayTotal}\r\n`
        } else {
          csv = csv + `\r\n`
        }
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${getDateLabel(props.data.date, props.data.intervalUnit)}.csv`);
    }
  })
}


export const accountSettingsPopup = (value, message, successMessage, action) => {
  Swal.queue([
    {
      text: message,
      input: "text",
      inputValue: value,
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: (newValue) => {
        if (newValue === value) {
          Swal.close();
        } else {
          return action(newValue)
            .then((data) => {
              Swal.insertQueueStep({
                icon: "success",
                text: successMessage,
                timer: 2000,
                showConfirmButton: false,
                showClass: {
                  popup: "",
                },
                allowOutsideClick: false,
              });
            })
            .catch(() => {
              Swal.showValidationMessage(`Something went wrong`);
            });
        }

      },
    },
  ]);
};


export const versionNotification = () => {
  Swal.fire({
    icon: "warning",
    text: `You are using an older version of the app. Please reload to update`,
    showConfirmButton: true,
    allowOutsideClick: false,
  });
}