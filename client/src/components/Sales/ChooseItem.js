import React, { useEffect } from "react";
import styles from "./ChooseItem.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { withRouter } from "react-router";
import { FaAngleLeft, FaGlasses, FaCashRegister, FaUser, FaUndo } from "react-icons/fa";
import { GiHospitalCross } from "react-icons/gi";
import { MdLocalHospital } from "react-icons/md";
import queryString from 'query-string'
import Swal from "sweetalert2";

const itemTypes = [
  { name: "Sale", link: "/add-sale", icon: <FaGlasses /> },
  { name: "Refund", link: "/add-refund", icon: <FaUndo /> },
  { name: "Petty Cash", link: "/add-expense", icon: <FaCashRegister /> },
  { name: "NHS Voucher", link: "/add-voucher", icon: <MdLocalHospital /> },
];

const TopRight = ({ user, history }) => {
  return (
    <div className={styles.topRight} onClick={() => {
      Swal.fire({
        text: "Would you like to change user?",
        showConfirmButton: true,
        confirmButtonText: "Yes",
        showCancelButton: true,
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          history.push('/home');
        } else if (result.isDenied) {
          Swal.close();
        }
      });
    }}>
      <FaUser /><span className={styles.topRightUser}>{user}</span>
    </div>
  );
};

const ListItem = ({ name, icon, onClick }) => (
  <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}>{icon}</div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>{name}</div>
    </div>
  </div>
);

const ChooseItem = (props) => {
  useEffect(() => {
    window.scroll(0, 0);
    const values = queryString.parse(props.location.search);
    const user = values.user;
    props.setTitle(`Add Item`);
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
    props.setRightComponent(<TopRight user={values.user} history={props.history} />)
  }, []);

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {itemTypes.map((item, i) => {
          return (
            <ListItem
              key={`itemType_${i}`}
              {...item}
              onClick={() => props.history.push({ pathname: item.link, search: props.location.search })}
            />
          );
        })}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChooseItem));
