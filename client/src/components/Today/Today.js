import React, { useEffect } from "react";
import styles from "./Today.module.css";
import { withRouter } from "react-router";
import Graph from "../Graph/Graph";
import MyPieChart from "../Graph/PieChart";
import moment from "moment";
import Swal from "sweetalert2";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { FaCashRegister } from "react-icons/fa";
import { Button } from "../UI/Button";
import Loading from "../Loading/Loading";

const tillFloatPopup = (value, action) => {
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

const TopRight = (props) => {
  return (
    <>
      <div
        className={styles.addSale}
        onClick={async () => {
          tillFloatPopup(props.data.tillFloat, props.actions.postTillFloat);
        }}
      >
        <FaCashRegister size={"25px"} />
      </div>
    </>
  );
};

const Today = (props) => {
  useEffect(() => {
    props.setTitle("Today");
    props.setLeftComponent(null);
    props.setRightComponent(() => {
      return props.data.tillFloat ? <TopRight {...props} /> : null;
    });
    props.actions.parseData(null, "day");
    props.actions.getTillFloat();
  }, []);

  useEffect(() => {
    props.setRightComponent(() => {
      return props.data.tillFloat ? <TopRight {...props} /> : null;
    });
  }, [props.data.tillFloat]);

  if (!props.data.data && props.data.getItemsLoading) {
    return <Loading />;
  }

  if (!props.data.data) {
    return null;
  }

  let isToday = false;
  if (props.data.data && props.data.data.length) {
    const currentDate = new Date();
    isToday = moment(currentDate).isSame(
      moment(props.data.data[props.data.data.length - 1].dateTime),
      "day"
    );
  }
  return (
    <div className={styles.wrapper}>
      {isToday ? (
        <div>
          <Graph {...props} />
          <div className={styles.buttons}>
            <Button
              style={{ marginTop: "32px" }}
              onClick={() => {
                props.history.push("/add");
              }}
            >
              Add Item
            </Button>
            {!props.data.tillFloat && (
              <Button
                onClick={async () => {
                  tillFloatPopup(
                    props.data.tillFloat,
                    props.actions.postTillFloat
                  );
                }}
              >
                Add Till Float
              </Button>
            )}
            <div
              className={styles.eod}
              onClick={() => {
                props.history.push("/eod");
              }}
            >
              End of Day
            </div>
          </div>
        </div>
      ) : (
          <Empty {...props} />
        )}
    </div>
  );
};

const getGreeting = () => {
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

const Empty = (props) => {
  return (
    <div>
      <div className={styles.greeting}>{getGreeting()}</div>
      <div className={styles.message}>
        There are no sales recorded for today yet
      </div>
      <div className={styles.buttonsWrapper}>
        <Button
          onClick={() => {
            props.history.push("/add");
          }}
        >
          Add Item
        </Button>
        {!props.data.tillFloat && (
          <Button
            onClick={async () => {
              tillFloatPopup(props.data.tillFloat, props.actions.postTillFloat);
            }}
          >
            Add Till Float
          </Button>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Today));
