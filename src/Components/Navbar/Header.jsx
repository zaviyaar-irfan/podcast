/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import Logo from "../../assets/logo/logo.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Dropdown, Space, Menu } from "antd";
import { FiMenu } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import icon from "../../assets/icon/Ellipse 2.png";
import { logout, selectUser } from "../../Redux/Slices/AuthSlice";

import { IoClose } from "react-icons/io5";
import ImageLoader from "../ImageLoader/ImageLoader";
const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const userData = useSelector(selectUser);

  const [search, setSearch] = useState(false);
  const location = useLocation();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authPath = location?.pathname;
  let allPath = false;
  let filterProduct = false;
  if (
    authPath === "/auth" ||
    authPath === "/forgetPass" ||
    authPath === "/login" ||
    authPath === "/verifyCode"
  ) {
    allPath = true;
  }

  if (authPath === "/filterProducts") {
    filterProduct = true;
  } else {
    filterProduct = false;
  }

  const HandleSearch = () => {
    setSearch((prevState) => !prevState);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  const AuthDrop = [
    {
      label: "Logout",
      key: "2",
      to: "/auth",
      onClick: handleLogout,
    },
  ];

  // modal data
  const menu = (
    <Menu>
      {AuthDrop.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick}>
          {item.to ? (
            <NavLink to={item.to}>{item.label}</NavLink>
          ) : (
            <NavLink to={item.to} onClick={item.onClick}>
              {item.label}
            </NavLink>
          )}
        </Menu.Item>
      ))}
    </Menu>
  );

  //

  return (
    <>
      <Navbar expand="lg" className="navBar00">
        <Container fluid>
          <NavLink
            to={"/"}
            className="d-flex align-items-center position-relative"
          >
            <img className="logoICon d-none d-md-block" src={Logo} alt="Logo" />
            {isSidebarOpen ? (
              <img
                className="sidebarIcon d-block d-md-none"
                src={Logo}
                alt="Logo"
              />
            ) : (
              ""
            )}
            {!isSidebarOpen ? (
              <Button
                variant="light"
                style={{ background: "transparent" }}
                className="d-md-none"
                onClick={toggleSidebar}
              >
                <FiMenu size={24} />
              </Button>
            ) : (
              <div
                className="d-block d-md-none closebtn00 "
                onClick={toggleSidebar}
              >
                <IoClose />
              </div>
            )}
          </NavLink>
          {!allPath ? (
            <>
              <Nav className="ms-auto naviner">
                <NavLink className=" border-0 navbarLink categoryDiv">
                  <Dropdown overlay={menu}>
                    <span
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="d-flex align-items-center ">
                        <h5 className="me-3 username00">
                          {userData?.userName || userData?.username}
                        </h5>
                        <ImageLoader
                          circeltrue="true"
                          classes={"userImg00"}
                          imageUrl={userData?.userImage || icon}
                        />
                      </div>
                    </span>
                  </Dropdown>
                </NavLink>
              </Nav>
            </>
          ) : (
            ""
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
