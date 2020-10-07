import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? <RouteComponent {...routeProps} /> : <ForceLogin />
      }
    />
  );
};

const ForceLogin = () => {
  window.location = "/login";
  return null;
};

export default PrivateRoute;
