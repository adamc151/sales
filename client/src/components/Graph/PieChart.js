import React, { useContext } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import styles from "./PieChart.module.css";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const data02 = [
  { name: "A1", value: 100 },
  { name: "A2", value: 300 },
  { name: "B1", value: 100 },
  { name: "B2", value: 80 },
  { name: "B3", value: 40 },
  { name: "B4", value: 30 },
  { name: "B5", value: 50 },
  { name: "C1", value: 100 },
  { name: "C2", value: 200 },
  { name: "D1", value: 150 },
  { name: "D2", value: 50 },
];

const MyPieChart = (props) => {
  if (!props.data) return null;

  console.log("yooo props.data", props.data);

  const total = props.data.data[props.data.data.length - 1].accumulative;

  const breakdowns = [];
  breakdowns.push({ name: "CASH", value: props.data.breakdowns["CASH"].total });
  breakdowns.push({ name: "CARD", value: props.data.breakdowns["CARD"].total });
  breakdowns.push({ name: "AMEX", value: props.data.breakdowns["AMEX"].total });

  console.log("yooo breakdowns", breakdowns);

  return (
    <div className={styles.graphsWrapper}>
      <div
        style={{
          height: "50vh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className={styles.graphWrapper2}>
          <div className={styles.total}>£{total}</div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdowns}
                dataKey="value"
                cx={"50%"}
                cy={200}
                innerRadius={"50%"}
                outerRadius={"60%"}
                fill="#82ca9d"
                label
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MyPieChart;
