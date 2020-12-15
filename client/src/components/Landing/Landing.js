import React, { useEffect } from "react";
import styles from "./Landing.module.css";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { FaCashRegister, FaUser } from "react-icons/fa";
import Loading from "../UI/Loading";
import { getGreeting, tillFloatPopup } from '../Utils/utils';
import { Button } from "../UI/Button";


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

const ListItem = ({ name, onClick }) => (
  <div className={styles.listItemWrapper} onClick={onClick}>
    <div className={styles.initial}><FaUser /></div>
    <div className={styles.detailsWrapper}>
      <div className={styles.productInfo}>{name}</div>
    </div>
  </div>
);

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

  console.log('yooooo props', props);

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

  const teamMembers = props.data.team;

  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>
        {teamMembers && teamMembers.length > 0 && teamMembers.map((item, i) => {
          return (
            <ListItem
              {...item}
              key={`team_member_${i}`}
              onClick={() => {
                props.history.push(`/add?user=${item.name}`); // In this case name needs to be unique or else bug city.
              }}
            />
          );
        })}
        {teamMembers && teamMembers.length > 0 && <Button // A button with styling might be better here?
          className={styles.eod}
          onClick={() => {
            props.history.push("/eod");
          }}
        >
          End of Day
            </Button>}
        {!teamMembers || teamMembers.length == 0 && <div style={{ 'padding': '20px' }}>
          <p>No team members found</p>
          <p>Team members are required in order to add 'items'</p>
          <p>To add team members go to 'Account Settings'</p>
        </div>}
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
