import React, { useState, useContext } from "react";
import styles from "./Layout.module.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  FaPlus,
  FaTachometerAlt,
  FaList,
  FaMinus,
  FaCalendarDay,
} from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { HiMenuAlt1 } from "react-icons/hi";
import { Link } from "react-router-dom";
import app from "../../firebase";
import { AuthContext } from "../../Auth";
// import { ToastContainer, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const Aside = ({ collapsed, toggled, handleToggleSidebar }) => {
  const { isOwner } = useContext(AuthContext);

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader style={{ padding: "24px" }}>
        {isOwner ? "Owner" : "Shop"}
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaCalendarDay />}>
            Today
            <Link to="/today" onClick={() => handleToggleSidebar(false)} />
          </MenuItem>
          <MenuItem icon={<FaList />}>
            Sales
            <Link to="/sales" onClick={() => handleToggleSidebar(false)} />
          </MenuItem>
          {isOwner ? (
            <MenuItem icon={<GoGraph />}>
              All
              <Link to="/all" onClick={() => handleToggleSidebar(false)} />
            </MenuItem>
          ) : (
            <></>
          )}
        </Menu>
      </SidebarContent>
      <SidebarFooter style={{ padding: "24px" }}>
        <div onClick={() => app.auth().signOut()}>Sign Out</div>
      </SidebarFooter>
    </ProSidebar>
  );
};

const Main = ({ handleToggleSidebar, children }) => {
  const [title, setTitle] = useState("");
  const [rightComponent, setRightComponent] = useState(null);
  const [leftComponent, setLeftComponent] = useState("");

  const childrenWithProps = React.Children.map(children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    const props = { setTitle, setRightComponent, setLeftComponent };
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });

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
      {/* <ToastContainer
        autoClose={2000}
        position={"bottom-center"}
        hideProgressBar={true}
        closeOnClick={true}
        draggable={true}
        progress={undefined}
        transition={Slide}
      /> */}
    </div>
  );
};

const Layout = ({ children, isLoading }) => {
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
        toggled={toggled}
        collapsed={collapsed}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      >
        {children}
      </Main>
    </div>
  );
};

export default Layout;
