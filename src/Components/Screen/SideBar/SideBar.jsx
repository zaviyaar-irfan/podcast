/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { Col, Container, Row, Nav } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import { FiHome } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

import { LuSearch } from "react-icons/lu";
import { CiCircleList } from "react-icons/ci";
import { HiOutlineSignal } from "react-icons/hi2";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaPlay } from "react-icons/fa6";
// import Discover from "../Discover/Discover";
import { auth } from "../../Firebase/Config";
import Header from "../../Navbar/Header";
import { NavLink, useLocation } from "react-router-dom";
// import PodDetail from "../PodDetail/PodDetail";
import Router from "../../../Routes/Router";

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const authPath = location?.pathname;
  let allPath = false;

  if (
    authPath === "/auth" ||
    authPath === "/login" ||
    authPath === "/forgetPass"
  ) {
    allPath = true;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  //

  return (
    <>
      {!allPath ? (
        <>
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Container fluid>
            <Tab.Container id="left-tabs-example" defaultActiveKey="home">
              <Row>
                <Col
                  className={`sidebar ${isSidebarOpen ? "open" : ""} col-8`}
                  xs={6}
                  sm={5}
                  md={3}
                  lg={2}
                  xl={2}
                >
                  <section className="colHead00">
                    <Nav variant="pills" className="flex-column mytabs">
                      <Nav.Item>
                        <NavLink to={"/"}>
                          <FiHome />
                          Home
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/addCat"}>
                          <FiPlus /> Add Data
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/listCategory"}>
                          <CiCircleList /> List Category
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/AddRadio"}>
                          <FiPlus />
                          Add Radio
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/RadioList"}>
                          <CiCircleList /> Radio List
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/AddBlogsCat"}>
                          <FiPlus /> Add Blog Category
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/AddBlog"}>
                          <FiPlus /> Add Blogs
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/BlogList"}>
                          <CiCircleList /> BlogList
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/Adbanners"}>
                          <FiPlus /> Add Banners
                        </NavLink>
                      </Nav.Item>
                      <Nav.Item>
                        <NavLink to={"/Bannerlist"}>
                          <FiPlus /> Banner list
                        </NavLink>
                      </Nav.Item>
                    </Nav>
                  </section>
                </Col>
                <Col xs={12} sm={12} md={9} lg={10} xl={10}>
                  <section className="mainSectionDiv00">
                    <Router />
                  </section>
                </Col>
              </Row>
            </Tab.Container>
          </Container>
        </>
      ) : (
        <Router />
      )}
    </>
  );
};

export default SideBar;
