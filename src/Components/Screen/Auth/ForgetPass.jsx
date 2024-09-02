/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSnackbar from "../../SnackBar/CustomSnackbar";

const ForgetPass = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const navigate = useNavigate();

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
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
  });

  // handle submit

  const handleSubmit = (values) => {};

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />

      <section style={{height:"100vh"}} className="sectionForget ">
        <div style={{marginBottom:"0px" ,}} className="mainTab00 bord d-flex align-items-center">
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
                <h5 className="authHead text-center mt-4 mb-4">My Account</h5>
                <h5 className="forgthead mb-4">Get Started</h5>
                <h5 className="registerText mb-3">
                  Lost your password? Please enter your email address. You will
                  receive a link to create a new password via email.
                </h5>
                <Form.Group
                  className="mb-2 hideFocus2"
                  controlId="formGroupEmail"
                >
                  <Form.Label className="lableHead">Email</Form.Label>
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

                <div className="d-flex flex-column">
                  <button
                    disabled={loading}
                    className={`loginBtn w-100 mt-3 ${
                      loading ? "disbalebtn" : ""
                    }`}
                  >
                    {loading ? (
                      <Spinner
                        style={{
                          width: "17px",
                          height: "17px",
                          marginTop: "3px",
                          borderWidth: "0.15em",
                        }}
                        animation="border"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Send Code"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
};

export default ForgetPass;
