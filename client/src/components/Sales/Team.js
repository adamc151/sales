import React, { useEffect, useState, useContext } from "react";
import styles from "./Team.module.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { withRouter } from "react-router";
import { FaUser, FaAngleLeft } from "react-icons/fa";

const teamMembers = [
  {
    name: "Amar",
    icon: <FaUser />,
  },
  { name: "Adam", icon: <FaUser /> },
  { name: "Ria", icon: <FaUser /> },
];

const ListItem = ({ name, icon, onClick }) => (
  <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}>{icon}</div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>{name}</div>
    </div>
  </div>
);

const Team = (props) => {
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    window.scroll(0, 0);
    props.setTitle("Select Team Member");
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
  }, []);

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {teamMembers.map((item, i) => {
          return (
            <ListItem
              {...item}
              setActive={() =>
                i === activeItem ? setActiveItem(null) : setActiveItem(i)
              }
              onClick={() => props.setTeamMember(item.name)}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Team));
