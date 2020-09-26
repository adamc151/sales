import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { withRouter } from "react-router";
import { toast } from "react-toastify";

import styles from "./EOD.module.css";
import { AuthContext } from "../../Auth";
import { FaPlus, FaCashRegister, FaAngleLeft } from "react-icons/fa";

const EOD = (props) => {
  const { token } = useContext(AuthContext);

  const [button, setButton] = useState("Submit");
  const [tillEqual, setTillEqual] = useState(null);
  const [cardMachineEqual, setCardMachineEqual] = useState(null);

  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);

  const [tillFloat, setTillFloat] = useState(200);

  const [editTillFloat, setEditTillFloat] = useState(false);

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
    props.setRightComponent(null);
    props.actions.parseData(null, "day", token);
  }, []);
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.sectionText}>Till Float (£)</div>
        <div className={styles.tillFloatOuter}>
          {editTillFloat ? (
            <div className={styles.priceWrapper}>
              <input
                className={`${styles.longInput} ${
                  tillEqual ? styles.inputCorrect : ""
                }`}
                type="number"
                placeholder="0.00"
                onChange={(e) => {
                  setTillFloat(Number(e.target.value));
                }}
                value={tillFloat}
              />
            </div>
          ) : (
            <div className={styles.tillFloatWrapper}>
              <span>£{tillFloat}</span>
            </div>
          )}
          <span
            className={styles.changeTillFloat}
            onClick={() => setEditTillFloat(!editTillFloat)}
          >
            {editTillFloat ? "Done" : "Change"}
          </span>
        </div>

        {/* <div className={styles.priceWrapper}>
          <input
            className={`${styles.longInput} ${
              tillEqual ? styles.inputCorrect : ""
            }`}
            type="number"
            placeholder="0.00"
            onChange={(e) => {
              setPrice1(Number(e.target.value));
            }}
          />
        </div> */}
      </div>
      <div>
        <div className={styles.sectionText}>Till Total (£)</div>
        <div className={styles.priceWrapper}>
          <input
            className={`${styles.longInput} ${
              tillEqual ? styles.inputCorrect : ""
            }`}
            type="number"
            placeholder="0.00"
            onChange={(e) => {
              setPrice1(Number(e.target.value));
            }}
          />
        </div>
        {tillEqual === false && (
          <div className={styles.errorMessage}>not equal</div>
        )}
      </div>
      <div>
        <div className={styles.sectionText}>Card Machine Total (£)</div>
        <div className={styles.priceWrapper}>
          <input
            className={`${styles.longInput} ${
              cardMachineEqual ? styles.inputCorrect : ""
            }`}
            type="number"
            placeholder="0.00"
            onChange={(e) => {
              setPrice2(Number(e.target.value));
            }}
          />
        </div>
        {cardMachineEqual === false && (
          <div className={styles.errorMessage}>not equal</div>
        )}
      </div>
      <button
        className={styles.confirm}
        onClick={async () => {
          console.log("yooo props", props);

          const { CASH, CARD, AMEX } = props.data.breakdowns;

          const isTillEqual = price1 === CASH.total;
          const isCardMachineEqual = price2 === CARD.total + AMEX.total;

          setCardMachineEqual(isCardMachineEqual);
          setTillEqual(isTillEqual);

          if (isTillEqual && isCardMachineEqual) {
            toast.success("All settled up!");
            setButton("All Settled");
          } else {
            toast.warn("Oops ...something went wrong");
            setButton("Try Again");
          }

          //   if (window.confirm("Are you sure you want to submit?")) {

          //     await props.actions.deleteItem(id, token);
          //     props.actions.loadItems(token);
          //     setActiveItem(null);
          //   }
        }}
      >
        {button}
      </button>
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
