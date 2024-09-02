/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import closeEye from "../../../assets/icon/close_eye.svg";
import openEye from "../../../assets/icon/open_eye.svg";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
// import { setToken } from "../../../store/reducer/AuthConfig";
import { ToastMessage } from "../../../utils/ToastMessage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/Config";
import { useDispatch } from "react-redux";
import {
  setAuthenticated,
  setToken,
  setUser,
} from "../../../Redux/Slices/AuthSlice";
import { getSingleDoc } from "../../Firebase/FirbaseService";

const Login = () => {
  const [inputType, setInputType] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setInputType(passwordVisible ? "password" : "text");
  };

  // snackbar

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  // handle submit

  const handleSubmit = async (value) => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(
        auth,
        value.email?.toLowerCase()?.trim(),
        value.password
      );

      console.log(res);

      setTimeout(() => {
        dispatch(setToken(res?.user?.uid));
        dispatch(setAuthenticated(true));
      }, 500);
      const userData = await getSingleDoc(res?.user?.uid, "users");
      navigate("/");

      dispatch(setUser(userData));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/wrong-password") {
        showSnackbar("Please enter valid email & password", "error");
      }
      if (error.code === "auth/invalid-email") {
        showSnackbar("Please enter valid email & password", "error");
      }
      if (error.code === "auth/user-not-found") {
        showSnackbar("User Not Found", "error");
      }
      if (error.code === "auth/network-request-failed") {
        showSnackbar("Request Failed Please try again", "error");
      }
      if (error.code === "auth/too-many-requests") {
        showSnackbar("Too Many Request");
      }
      if (error.code === "auth/invalid-credential") {
        showSnackbar("Invalid Credential", "error");
      }
      console.log("================LoginError", error.code, error.message);
    }
  };

  return (
    <>
      <CustomSnackBar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form className="w-100 formHead" onSubmit={handleSubmit}>
            <h5 className="loginHead text-center mt-4 mb-4">
              Welcome Back Admin
            </h5>
            <h5 className="text-center loginsbHead mb-3">
              Please sign in to access your full account
            </h5>
            <section className="bord">
              <Form.Group
                className="mb-2 hideFocus2"
                controlId="formGroupEmail"
              >
                <Form.Label className="lableHead">
                  Username or email address{" "}
                </Form.Label>
                <Form.Control
                  className="radius_12"
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                {touched.email && errors.email && (
                  <div className="errorMsg">{errors.email}</div>
                )}
              </Form.Group>
              <Form.Group
                className="mb-2 hideFocus2"
                controlId="formGroupPassword"
              >
                <Form.Label className="lableHead">Password</Form.Label>
                <div className="d-flex align-items-center position-relative">
                  <Form.Control
                    className="radius_12"
                    type={inputType}
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                  />
                  <img
                    className="pass_img"
                    src={passwordVisible ? openEye : closeEye}
                    alt=""
                    onClick={togglePasswordVisibility}
                  />
                </div>
                {touched.password && errors.password && (
                  <div className="errorMsg">{errors.password}</div>
                )}
              </Form.Group>
              <div className="d-flex flex-column">
                <button
                  disabled={loading}
                  className={`loginBtn mt-3 ${loading ? "disbalebtn" : ""}`}
                >
                  {loading ? (
                    <Spinner
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "3px",
                        borderWidth: "0.15em",
                      }}
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </section>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
