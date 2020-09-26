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
        change: temp,
        dateTime: dateTime.toISOString(),
        paymentMethod,
        productID: Math.floor(Math.random() * 10000) + 100000,
        productDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      });
    } else {
      const temp2 = Math.floor(Math.random() * 15);
      data.push({
        change: temp2,
        isExpense: true,
        dateTime: dateTime.toISOString(),
        paymentMethod: null,
        productID: null,
        productDescription:
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
