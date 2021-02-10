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

  const format = intervalUnit === 'day' ? 'LLL' : 'LL';
  let displayValue = '';

  if (data.length) {
    displayValue = data[data.length - 1].negative ? data[data.length - 1].value * -1 : data[data.length - 1].value;
  }

  if (active) {
    displayValue = payload[0].payload.negative ? payload[0].value * -1 : payload[0].value;
  }

  return (
    <div>
      <div style={{ fontSize: "42px", textAlign: "left" }}>{data[myLabel].accumulative < 0 ? '- ' : ''}{`£${Math.abs(data[myLabel].accumulative)}`}</div>
      <div style={{ fontSize: "14px", color: "grey", textAlign: "left" }}>{`${displayValue < 0 ? "-" : "+"} £${Math.abs(displayValue)}`}</div>
      <div style={{ fontSize: "14px", color: "grey", textAlign: "left" }} >{`${moment(data[myLabel].dateTime).format(format)}`}</div>
    </div>
  );
};

const Graph = (props) => {

  if (!props.data.graphData) return null;

  return (
    <div className={styles.graphsWrapper}>
      {props.data.graphData ? <div
        style={{
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {props.data.graphData && props.data.graphData.length ? (
          <div className={styles.graphWrapper}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              className={styles.responsiveContainer}
              stackOffset={"expand"}
            >
              <ComposedChart
                data={props.data.graphData}
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
                  {props.data.graphData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.negative ? "#f2f2f2" : "#f0f6ff"}
                    />
                  ))}
                </Bar>
                <YAxis dataKey="value" domain={[0, "dataMax"]} hide />
                <Tooltip
                  wrapperStyle={{ visibility: "visible", position: 'absolute', top: '-110px', left: '0px' }}
                  content={
                    <CustomTooltip data={props.data.graphData} active={true} allowEscapeViewBox={{ x: true, y: true }} intervalUnit={props.data.intervalUnit} />
                  }
                  position={{ x: 20, y: 80 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        {props.data.graphData && props.data.graphData.length > 1 ? (
          <div className={styles.graphWrapper2}>
            <ResponsiveContainer width="100%" height="100%" className={styles.responsiveContainer}>
              <LineChart
                data={props.data.graphData}
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
