/* eslint-disable no-unused-vars */
import React from "react";
import Login from "./Login";
import SignUp from "./Signup";
import { Tab, Tabs } from "react-bootstrap";

const Auth = () => {
  return (
    <>
      <section className="sectionTop mt-5">
        <div className="mainTab00">
          <h5 className="authHead text-center mt-3 mb-3">My Account</h5>
          <Login />
        </div>
      </section>
    </>
  );
};

export default Auth;
