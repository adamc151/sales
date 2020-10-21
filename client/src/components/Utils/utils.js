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
