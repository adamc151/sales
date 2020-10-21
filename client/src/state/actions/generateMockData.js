const dates = require("../dates.json");
const fs = require("fs");

const paymentMethods = ["CASH", "CARD", "AMEX"];

const generateAll = () => {
  const data = [];
  for (let i = 0; i < dates.length; i++) {
    const isSale = Math.floor(Math.random() * 15) > 0;
    const dateTime = new Date(dates[i]);

    if (isSale) {
      const temp = Math.floor(Math.random() * 150) + 10;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * 3)];

      data.push({
        value: temp,
        type: 'SALE',
        dateTime: dateTime.toISOString(),
        paymentMethod,
        details:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      });
    } else {
      const temp2 = Math.floor(Math.random() * 15);
      data.push({
        value: temp2,
        type: 'EXPENSE',
        dateTime: dateTime.toISOString(),
        paymentMethod: 'CASH',
        details:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      });
    }
  }
  return data;
};

const data = generateAll();

fs.writeFile("../mockData.json", JSON.stringify(data), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});
