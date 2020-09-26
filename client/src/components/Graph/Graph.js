import React, { useContext } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  YAxis,
  Cell,
} from "recharts";
import styles from "./Graph.module.css";
import moment from "moment";

const CustomTooltip = ({ active, payload, label, data }) => {
  const myLabel = active ? label : data.length - 1;
  const myPayload = [
    {
      color: "#f2f0ff",
      dataKey: "value",
      fill: "#f2f0ff",
      formatter: undefined,
      name: "value",
      payload: {
        value: 135,
        dateTime: "2020-09-04T18:16:08.000Z",
        paymentMethod: "CASH",
        productID: 107923,
        productDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing…mpor incididunt ut labore et dolore magna aliqua.",
      },
      stroke: "#f2f0ff",
      type: undefined,
      unit: undefined,
      value: data[data.length - 1].value,
    },
  ];

  return (
    <div>
      <div
        style={{ fontSize: "42px", textAlign: "left" }}
      >{`£${data[myLabel].accumulative}`}</div>
      <div style={{ fontSize: "14px", color: "grey", textAlign: "left" }}>{`${
        data[myLabel].isExpense ? "-" : "+"
      } £${active ? payload[0].value : myPayload[0].value}`}</div>
      <div
        style={{ fontSize: "14px", color: "grey", textAlign: "left" }}
      >{`${moment(data[myLabel].dateTime).format("LLL")}`}</div>
    </div>
  );
};

const Graph = (props) => {
  if (!props.data) return null;

  return (
    <div className={styles.graphsWrapper}>
      <div
        style={{
          height: "50vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {props.data.data ? (
          <div className={styles.graphWrapper}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              stackOffset={"expand"}
            >
              <ComposedChart
                data={props.data.data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <Bar
                  type="monotone"
                  dataKey="value"
                  stroke="#f0f6ff"
                  fill="#f0f6ff"
                  isAnimationActive={true}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  {props.data.data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={!entry.isExpense ? "#f0f6ff" : "#f2f2f2"}
                    />
                  ))}
                </Bar>
                <YAxis dataKey="value" domain={[0, "dataMax"]} hide />
                <Tooltip
                  wrapperStyle={{ visibility: "visible" }}
                  content={
                    <CustomTooltip data={props.data.data} active={true} />
                  }
                  position={{ x: 20, y: 20 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {props.data.data && props.data.data.length > 1 ? (
          <div className={styles.graphWrapper2}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={props.data.data}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="accumulative"
                  stroke="#004990"
                  activeDot={{ r: 8 }}
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Graph;
