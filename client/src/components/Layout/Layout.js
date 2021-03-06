import React, { useState } from "react";
import styles from "./Layout.module.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { FaList, FaHome, FaUserCog, FaPlus } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { MdLocalHospital } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { HiMenuAlt1 } from "react-icons/hi";
import { FiUpload } from "react-icons/fi";
import { Link } from "react-router-dom";
import app from "../Authentication/firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/authActions";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const Aside = connect(mapStateToProps, mapDispatchToProps)(({ collapsed, toggled, handleToggleSidebar, auth }) => {
  const { isOwner, shopName } = auth || {};
  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader style={{ padding: "16px 24px" }}>
        {`${shopName || ''} ${isOwner ? "(Owner)" : "(Shop)"}`}
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          {isOwner ? <MenuItem icon={<GoGraph />}>
            Dashboard
            <Link to="/dashboard" onClick={() => handleToggleSidebar(false)} />
          </MenuItem> : (
              <></>
            )}
          <MenuItem icon={<FaPlus />}>
            Add Item
              <Link to="/add-item" onClick={() => handleToggleSidebar(false)} />
          </MenuItem>
          <MenuItem icon={<FaList />}>
            Sales
            <Link to="/sales" onClick={() => handleToggleSidebar(false)} />
          </MenuItem>
          <MenuItem icon={<MdLocalHospital />}>
            NHS Vouchers
            <Link to="/vouchers" onClick={() => handleToggleSidebar(false)} />
          </MenuItem>
          {false ? (
            <MenuItem icon={<FiUpload />}>
              Upload
              <Link to="/upload" onClick={() => handleToggleSidebar(false)} />
            </MenuItem>
          ) : (
              <></>
            )}
          {isOwner ? (
            <MenuItem icon={<FaUserCog />}>
              Account Settings
              <Link to="/settings" onClick={() => handleToggleSidebar(false)} />
            </MenuItem>
          ) : (
              <></>
            )}

          {false ? <SubMenu title="Switch Shop" icon={<AiFillShop />}>
            <MenuItem>Shop 1</MenuItem>
            <MenuItem>Shop 2</MenuItem>
            <MenuItem>Shop 3</MenuItem>
            <MenuItem>Shop 4</MenuItem>
            <MenuItem>Shop 5</MenuItem>
            <MenuItem>Shop 6</MenuItem>
            <MenuItem>Add New Shop</MenuItem>
          </SubMenu> : <></>}
        </Menu>
      </SidebarContent>
      <SidebarFooter style={{ padding: "16px 24px" }}>
        <div style={{ 'cursor': 'pointer' }} onClick={() => app.auth().signOut()}>Sign Out</div>
      </SidebarFooter>
    </ProSidebar>
  );
});

const Main = ({ handleToggleSidebar, children }) => {
  const [title, setTitle] = useState("");
  const [rightComponent, setRightComponent] = useState(null); // Should this be called setTopRightComponent?
  const [leftComponent, setLeftComponent] = useState(""); // Should this be called setTopLeftComponent?

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        {title}
        {leftComponent || (
          <div
            className={styles.sidebarToggle}
            onClick={() => handleToggleSidebar(true)}
          >
            <HiMenuAlt1 size={"32px"} />
          </div>
        )}
        {rightComponent}
      </div>
      {children(setTitle, setRightComponent, setLeftComponent)}
    </div>
  );
};

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <div className={`${styles.app} ${toggled ? "toggled" : ""}`}>
      <Aside
        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
      />
      <Main
        toggled={toggled} // No need?
        collapsed={collapsed} // No need?
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange} // No need?
      >
        {children}
      </Main>
    </div>
  );
};

export default Layout;


