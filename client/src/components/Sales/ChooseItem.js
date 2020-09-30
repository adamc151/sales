import React, { useEffect, useState } from "react";
import styles from "./Team.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { withRouter } from "react-router";
import { FaAngleLeft, FaGlasses, FaCashRegister } from "react-icons/fa";

const itemTypes = [
  {
    name: "Sale",
    link: "/add",
    icon: <FaGlasses />,
  },
  { name: "Petty Cash", link: "/add-expense", icon: <FaCashRegister /> },
];

const ListItem = ({ name, icon, onClick }) => (
  <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}>{icon}</div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>{name}</div>
    </div>
  </div>
);

const ChooseItem = (props) => {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    window.scroll(0, 0);
    props.setTitle("Select Item Type");
    // props.setLeftComponent(null);
    props.setRightComponent(null);
    props.setLeftComponent(() => (
      <div
        className={styles.backNavigation}
        onClick={() => {
          //   props.actions.loadItems();
          props.history.goBack();
        }}
      >
        <FaAngleLeft size={"32px"} />
      </div>
    ));
  }, []);

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {itemTypes.map((item, i) => {
          return (
            <ListItem
              {...item}
              setActive={() =>
                i === activeItem ? setActiveItem(null) : setActiveItem(i)
              }
              onClick={() => props.history.push(item.link)}
              isActive={i === activeItem}
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
