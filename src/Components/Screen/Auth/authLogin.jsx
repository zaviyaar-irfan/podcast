/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo/logo.png";

const AuthLogin = () => {
  const navigate = useNavigate();

  return (
    <>
      <section style={{height:"100vh"}} className="sectionTop">
        <div style={{height:"100vh"}} className="mainTab00 d-flex align-items-center justify-content-center">
          <section className="bord">
            <div className="d-flex flex-column  align-items-center">
              <img className="logoICon mb-3" src={Logo} alt="" />
              <h5 className="text-center loginsbHead mb-3">
                Let the stories Begin
              </h5>
              <div className="googlbtn w-100">
                <FaGoogle className="googlicon" />
                Continue with Goggle
              </div>
              <div className="d-flex align-items-center mt-3">
                <div className="divder00 me-3"></div>
                <span className="textdiv">Or</span>
                <div className="divder00 ms-3"></div>
              </div>
              <NavLink
                to={"/auth"}
                className={`loginBtn mt-3 text-center w-100`}
              >
                Sign In with Email
              </NavLink>

              <div className="mt-4 privcytext">
                By continuing , I agree to <span>Terms of Conditions </span> and
                <span>Privacy of Policy</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default AuthLogin;
