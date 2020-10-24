import Swal from "sweetalert2";

export const getGreeting = () => {
  var hr = new Date().getHours();
  let greeting = "";
  var data = [
    [0, 4, "Good Morning"],
    [5, 11, "Good Morning"],
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


export const getDateTitle = (date, intervalUnit) => {
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