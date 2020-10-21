import React, { useEffect } from "react";
import styles from "./Landing.module.css";
import { withRouter } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { FaCashRegister, FaUser } from "react-icons/fa";
import Loading from "../Loading/Loading";
import { getGreeting } from '../Utils/utils';

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

const Landing = (props) => {
  useEffect(() => {
    props.setTitle(getGreeting());
    props.setLeftComponent(null);
    props.setRightComponent(() => {
      return <TopRight {...props} />;
    });
    props.actions.parseData(null, "day");
    props.actions.getTillFloat();
    props.actions.getTeam();
  }, []);

  useEffect(() => {
    props.setRightComponent(() => {
      return <TopRight {...props} />;
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
    <Empty {...props} />
  );
};

const ListItem = ({ name, onClick }) => (
  <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}><FaUser /></div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>{name}</div>
    </div>
  </div>
);

const Empty = (props) => {
  const teamMembers = props.data.team;
  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {teamMembers && teamMembers.length && teamMembers.map((item, i) => {
          return (
            <ListItem
              {...item}
              onClick={() => {
                props.history.push(`/add?user=${item.name}`);
              }}
            />
          );
        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
