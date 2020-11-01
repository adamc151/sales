import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { withRouter } from "react-router";
import Swal from "sweetalert2";
import styles from "./EOD.module.css";
import { FaAngleLeft, FaCashRegister } from "react-icons/fa";
import { Button } from "../UI/Button";
import { tillFloatPopup } from '../Utils/utils';

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

const EOD = (props) => {
  const [button, setButton] = useState("Submit");
  const [tillDiff, setTillDiff] = useState(null);
  const [cardMachineDiff, setCardMachineDiff] = useState(null);
  const [allSettled, setAllSettled] = useState(false);

  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);

  useEffect(() => {
    props.setTitle("END OF DAY");
    props.setLeftComponent(() => (
      <div
        className={styles.backNavigation}
        onClick={() => {
          props.history.goBack();
        }}
      >
        <FaAngleLeft size={"32px"} />
      </div>
    ));
    props.setRightComponent(<TopRight {...props} />);
    props.actions.parseData(null, "day");
    props.actions.getTillFloat();
  }, []);

  useEffect(() => {
    props.setRightComponent(() => {
      return <TopRight {...props} />;
    });
  }, [props.data.tillFloat]);

  const handleSumbit = (e) => {
    e.preventDefault();
    e.target.querySelector("input").blur();
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.sectionText}>Till Float (£)</div>
        <div className={styles.tillFloatOuter}>
          <div className={styles.tillFloatWrapper}>
            <span>£{props.data.tillFloat}</span>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.sectionText}>Till Total (£)</div>
        <div className={styles.priceWrapper}>
          <form style={{ width: "100%" }} onSubmit={handleSumbit}>
            <input
              className={`${styles.longInput} ${tillDiff === 0 ? styles.inputCorrect : ""
                } ${tillDiff !== null && tillDiff !== 0 ? styles.inputIncorrect : ""
                }`}
              type="number"
              placeholder="0.00"
              onChange={(e) => {
                setPrice1(Number(e.target.value));
              }}
            />
          </form>
          {tillDiff !== null && tillDiff !== 0 && (
            <div className={styles.errorMessage}>
              {tillDiff < 0
                ? `under by £${Math.abs(tillDiff)}`
                : `over by £${tillDiff}`}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className={styles.sectionText}>Card Machine Total (£)</div>
        <div className={styles.priceWrapper}>
          <form style={{ width: "100%" }} onSubmit={handleSumbit}>
            <input
              className={`${styles.longInput} ${cardMachineDiff === 0 ? styles.inputCorrect : ""
                } ${cardMachineDiff !== null && cardMachineDiff !== 0
                  ? styles.inputIncorrect
                  : ""
                }`}
              type="number"
              placeholder="0.00"
              onChange={(e) => {
                setPrice2(Number(e.target.value));
              }}
            />
          </form>
          {cardMachineDiff !== null && cardMachineDiff !== 0 && (
            <div className={styles.errorMessage}>
              {cardMachineDiff < 0
                ? `under by £${Math.abs(cardMachineDiff)}`
                : `over by £${cardMachineDiff}`}
            </div>
          )}
        </div>
      </div>
      {false ? (
        <div className={styles.allSettled}>All Settled</div>
      ) : (
          <Button
            isLoading={props.data.addNotificationLoading}
            style={{ marginTop: "32px" }}
            onClick={async () => {
              if (props.data.addNotificationLoading) return;
              if (allSettled) {
                props.history.goBack();
              } else {
                const { CASH, CARD, AMEX } = props.data.breakdowns;
                const tillDiff = Number((price1 - (CASH.total + props.data.tillFloat)).toFixed(2));
                const cardMachineDiff = Number((price2 - (CARD.total + AMEX.total)).toFixed(2));

                setTillDiff(tillDiff);
                setCardMachineDiff(cardMachineDiff);

                if (tillDiff === 0 && cardMachineDiff === 0) {
                  props.actions.postNotification({
                    dateTime: new Date().toISOString(),
                    message: `Successfully settled up!\r\nTill: ${CASH.total + props.data.tillFloat < 0 ? '-' : ''} £${Math.abs(CASH.total + props.data.tillFloat).toFixed(2)}\r\nCard Machine: ${CARD.total + AMEX.total < 0 ? '-' : ''} £${Math.abs(CARD.total + AMEX.total).toFixed(2)}`
                  });
                  Swal.queue([
                    {
                      icon: "success",
                      title: "All settled up!",
                      showConfirmButton: true,
                      confirmButtonText: `Set till float £${Number((CASH.total + props.data.tillFloat).toFixed(2))}`,
                      showCancelButton: true,
                      cancelButtonText: "Close",
                      showLoaderOnConfirm: true,
                      preConfirm: (tillFloat) => {
                        return props.actions.postTillFloat(Number((CASH.total + props.data.tillFloat).toFixed(2)))
                          .then((data) => {
                            Swal.insertQueueStep({
                              icon: "success",
                              title: `£${Number((CASH.total + props.data.tillFloat).toFixed(2))}`,
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
                      },
                    },
                  ]);

                  setButton("Go Back");
                  setAllSettled(true);
                } else {
                  let tillMessage;
                  let cardMessage;

                  if (tillDiff === 0) {
                    tillMessage = `Till: ${CASH.total + props.data.tillFloat < 0 ? '-' : ''} £${Math.abs(CASH.total + props.data.tillFloat).toFixed(2)} (correct)`;
                  } else if (tillDiff > 0) {
                    tillMessage = `Till entry over by £${Math.abs(tillDiff)}`;
                  } else if (tillDiff < 0) {
                    tillMessage = `Till entry under by £${Math.abs(tillDiff)}`;
                  }

                  if (cardMachineDiff === 0) {
                    cardMessage = `Card Machine: ${CARD.total + AMEX.total < 0 ? '-' : ''} £${Math.abs(CARD.total + AMEX.total).toFixed(2)} (correct)`;
                  } else if (cardMachineDiff > 0) {
                    cardMessage = `Card Machine entry over by £${Math.abs(cardMachineDiff)}`;
                  } else if (cardMachineDiff < 0) {
                    cardMessage = `Card Machine entry under by £${Math.abs(cardMachineDiff)}`;
                  }

                  props.actions.postNotification({
                    dateTime: new Date().toISOString(),
                    message: `Failed to settled up!\r\n${tillMessage}\r\n${cardMessage}`
                  });
                  setButton("Try Again");
                }
              }
            }}
          >
            {button}
          </Button>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EOD));
