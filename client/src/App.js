import React, { useContext } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Today from "./components/Today/Today";
import Login from "./components/Login/Login";
import Sales from "./components/Sales/Sales";
import Team from "./components/Sales/Team";
import AddItem from "./components/Sales/AddItem";
import AddExpense from "./components/Expenses/AddExpense";
import EOD from "./components/Today/EOD";
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
            <Route exact path="/today" render={() => <Today {...props} />} />
            <Route
              exact
              path="/choose"
              render={() => <ChooseItem {...props} />}
            />
            <Route exact path="/eod" render={() => <EOD {...props} />} />
            <Route exact path="/sales" render={() => <Sales {...props} />} />
            <Route exact path="/team" render={() => <Team {...props} />} />
            <Route exact path="/add" render={() => <AddItem {...props} />} />
            <Route
              exact
              path="/add-expense"
              render={() => <AddExpense {...props} />}
            />
            <Route exact path="/" render={() => <Redirect to={"/today"} />} />
            {isOwner && (
              <Route
                exact
                path="/all"
                render={() => <Dashboard {...props} />}
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
