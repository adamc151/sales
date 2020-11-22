import React from "react";
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

const CustomTooltip = ({ active, payload, label, data, intervalUnit }) => {
  const myLabel = active ? label : data.length - 1;
  const myPayload = [
    {
      color: "#f2f0ff",
      dataKey: "value",
      fill: "#f2f0ff",
      name: "value",
      stroke: "#f2f0ff",
      value: data.length && data[data.length - 1].value,
    },
  ];

  const format = intervalUnit === 'day' ? 'LLL' : 'LL';

  return (
    <div>
      <div
        style={{ fontSize: "42px", textAlign: "left" }}
      >{`£${data[myLabel].accumulative}`}</div>
      <div style={{ fontSize: "14px", color: "grey", textAlign: "left" }}>{`${data[myLabel].type === 'EXPENSE' || data[myLabel].type === 'REFUND' ? "-" : "+"
        } £${active ? payload[0].value : myPayload[0].value}`}</div>
      <div
        style={{ fontSize: "14px", color: "grey", textAlign: "left" }}
      >{`${moment(data[myLabel].dateTime).format(format)}`}</div>
    </div>
  );
};

const Graph = (props) => {

  if (!props.data.data) return null;

  return (
    <div className={styles.graphsWrapper}>
      {props.data.data ? <div
        style={{
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {props.data.data && props.data.data.length ? (
          <div className={styles.graphWrapper}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              className={styles.responsiveContainer}
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
                      fill={entry.type === 'EXPENSE' || entry.type === 'REFUND' ? "#f2f2f2" : "#f0f6ff"}
                    />
                  ))}
                </Bar>
                <YAxis dataKey="value" domain={[0, "dataMax"]} hide />
                <Tooltip
                  wrapperStyle={{ visibility: "visible", position: 'absolute', top: '-110px', left: '0px' }}
                  content={
                    <CustomTooltip data={props.data.data} active={true} allowEscapeViewBox={{ x: true, y: true }} intervalUnit={props.data.intervalUnit} />
                  }
                  position={{ x: 20, y: 80 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {props.data.data && props.data.data.length > 1 ? (
          <div className={styles.graphWrapper2}>
            <ResponsiveContainer width="100%" height="100%" className={styles.responsiveContainer}>
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
      </div> : null}
    </div>
  );
};

export default Graph;
