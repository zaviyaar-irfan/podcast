/* eslint-disable no-unused-vars */
import React, { lazy, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../Redux/Slices/AuthSlice";
import AddRadio from "../Components/Screen/AddCategory/AddRadio";
import RadioList from "../Components/Screen/AddCategory/RadioList";
import AddBanner from "../Components/Screen/AddCategory/AddBanner";
import AddblogCategory from "../Components/Screen/AddCategory/AddblogCategory";
import AddBogs from "../Components/Screen/AddCategory/AddBogs";
import BlogList from "../Components/Screen/AddCategory/BlogList";
import Bannerlist from "../Components/Screen/AddCategory/Bannerlist";
import AddChannels from "../Components/Screen/AddCategory/AddChannels";
import ChannelList from "../Components/Screen/AddCategory/ChannelList";

const Home = lazy(() => import("../Components/Screen/Home/index"));
const Auth = lazy(() => import("../Components/Screen/Auth/Auth"));

const Login = lazy(() => import("../Components/Screen/Auth/authLogin"));
const AddCat = lazy(() => import("../Components/Screen/AddCategory/index"));
const ListCategory = lazy(() =>
  import("../Components/Screen/AddCategory/ListCategory")
);

const Router = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // const isAuthenticated = false; .
  return (
    <Suspense
      fallback={
        <div className="lazy_spiner">
          <Spinner animation="grow" variant="success" />
        </div>
      }
    >
      {useRoutes([
        // auth path start
        {
          path: "/",
          element: isAuthenticated ? <Home /> : <Navigate to="/login" />,
        },
        {
          path: "/login",
          element: !isAuthenticated ? <Login /> : <Navigate to="/" />,
        },
        {
          path: "/auth",
          element: !isAuthenticated ? <Auth /> : <Navigate to="/" />,
        },

        // othe screen
        {
          path: "/AddCat",
          element: isAuthenticated ? <AddCat /> : <Navigate to="/" />,
        },
        {
          path: "/listCategory",
          element: isAuthenticated ? <ListCategory /> : <Navigate to="/" />,
        },

        {
          path: "/AddRadio",
          element: isAuthenticated ? <AddRadio /> : <Navigate to="/" />,
        },
        {
          path: "/RadioList",
          element: isAuthenticated ? <RadioList /> : <Navigate to="/" />,
        },
        {
          path: "/Adbanners",
          element: isAuthenticated ? <AddBanner /> : <Navigate to="/" />,
        },
        {
          path: "/AddBlogsCat",
          element: isAuthenticated ? <AddblogCategory /> : <Navigate to="/" />,
        },
        {
          path: "/AddBlog",
          element: isAuthenticated ? <AddBogs /> : <Navigate to="/" />,
        },
        {
          path: "/BlogList",
          element: isAuthenticated ? <BlogList /> : <Navigate to="/" />,
        },
        {
          path: "/Bannerlist",
          element: isAuthenticated ? <Bannerlist /> : <Navigate to="/" />,
        },
        {
          path: "/AddChannels",
          element: isAuthenticated ? <AddChannels /> : <Navigate to="/" />,
        },
        {
          path: "/ChannelList",
          element: isAuthenticated ? <ChannelList /> : <Navigate to="/" />,
        },
      ])}
    </Suspense>
  );
};

export default Router;
