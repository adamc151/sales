import React, { useContext } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Today from "./components/Today/Today";
import Landing from "./components/Today/Landing";

import Login from "./components/Login/Login";
import Sales from "./components/Sales/Sales";
import AddItem from "./components/Sales/AddItem";

import EOD from "./components/Today/EOD";
import Upload from "./components/Upload/Upload";
import { Redirect } from "react-router";

import { AuthProvider } from "./Auth";
import { AuthContext } from "./Auth";

import PrivateRoute from "./ProvateRoute";
import ChooseItem from "./components/Sales/ChooseItem";

const PrivateRoutes = () => {
  const { isOwner } = useContext(AuthContext);
  return (
    <Layout>
      {(setTitle, setRightComponent, setLeftComponent) => {
        const props = { setTitle, setRightComponent, setLeftComponent };
        return (
          <>
            <Route exact path="/home" render={() => <Landing {...props} />} />
            <Route
              exact
              path="/add"
              render={() => <ChooseItem {...props} />}
            />
            <Route exact path="/eod" render={() => <EOD {...props} />} />
            <Route exact path="/sales" render={() => <Sales {...props} />} />
            <Route
              exact
              path="/add-sale"
              render={() => <AddItem type={"SALE"} title={"Add Sale"} {...props} />}
            />
            <Route
              exact
              path="/add-refund"
              render={() => <AddItem type={"REFUND"} title={"Add Refund"} {...props} />}
            />
            <Route
              exact
              path="/add-expense"
              render={() => <AddItem type={"EXPENSE"} title={"Add Expense"} defaultPaymentType={"CASH"} {...props} />}
            />
            <Route exact path="/" render={() => <Redirect to={"/home"} />} />
            {isOwner && (
              <Route
                exact
                path="/graph"
                render={() => <Dashboard {...props} />}
              />
            )}
            {isOwner && (
              <Route
                exact
                path="/upload"
                render={() => <Upload {...props} />}
              />
            )}
          </>
        );
      }}
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AuthProvider>
          <Switch>
            <Route path="/login" render={() => <Login />} />
            <PrivateRoute component={PrivateRoutes} />
          </Switch>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
