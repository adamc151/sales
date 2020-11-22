import React, { useContext } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";
import Login from "./components/Login/Login";
import Sales from "./components/Sales/Sales";
import Vouchers from "./components/Sales/Vouchers";
import AddItem from "./components/Sales/AddItem";
import ChooseItem from "./components/Sales/ChooseItem";
import EOD from "./components/Landing/EOD";
import Upload from "./components/Upload/Upload";
import Settings from "./components/Settings/Settings";
import Notifications from "./components/Notifications/Notifications";
import { Redirect } from "react-router";
import { AuthProvider, AuthContext } from "./components/Authentication/Auth";
import PrivateRoute from "./components/Authentication/PrivateRoute";

const PrivateRoutes = () => {
  const { isOwner } = useContext(AuthContext);
  return (
    <Layout>
      {(setTitle, setRightComponent, setLeftComponent) => {
        const props = { setTitle, setRightComponent, setLeftComponent };
        return (
          <>
            <Route exact path="/" render={() => isOwner ? <Redirect to={"/dashboard"} /> : <Redirect to={"/add-item"} />} />

            <Route exact path="/eod" render={() => <EOD {...props} />} />
            <Route exact path="/sales" render={() => <Sales {...props} />} />
            <Route exact path="/vouchers" render={() => <Vouchers {...props} />} />
            <Route exact path="/add-item" render={() => <Landing {...props} />} />

            <Route exact path="/add" render={() => <ChooseItem {...props} />} />
            <Route exact path="/add-sale" render={() => <AddItem type={"SALE"} title={"Add Sale"} {...props} />} />
            <Route exact path="/add-refund" render={() => <AddItem type={"REFUND"} title={"Add Refund"} {...props} />} />
            <Route exact path="/sales/edit/:id" render={() => <AddItem isEdit={true} title={"Edit Item"} {...props} />} />
            <Route exact path="/add-expense" render={() => <AddItem type={"EXPENSE"} title={"Add Expense"} defaultPaymentType={"CASH"} {...props} />} />
            <Route exact path="/add-voucher" render={() => <AddItem type={"VOUCHER"} title={"Add NHS Voucher"} {...props} />} />

            {isOwner &&
              <>
                <Route exact path="/dashboard" render={() => <Dashboard {...props} />} />
                <Route exact path="/notifications" render={() => <Notifications {...props} />} />
                <Route exact path="/add-daily" render={() => <AddItem type={"DAILY"} title={"Add Daily"} {...props} />} />
                <Route exact path="/graph" render={() => <Dashboard {...props} />} />
                <Route exact path="/upload" render={() => <Upload {...props} />} />
                <Route exact path="/settings" render={() => <Settings {...props} />} />
              </>}
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
            <Route path="/(login|signup|reset-password|termsandconditions|privacypolicy)" render={() => <Login />} />
            <PrivateRoute component={PrivateRoutes} />
          </Switch>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
