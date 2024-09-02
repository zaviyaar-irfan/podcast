/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import closeEye from "../../../assets/icon/close_eye.svg";
import openEye from "../../../assets/icon/open_eye.svg";
import { NavLink, useNavigate } from "react-router-dom";

import CustomSnackbar from "../../SnackBar/CustomSnackbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage } from "../../Firebase/Config";
import { ToastMessage } from "../../../utils/ToastMessage";
import { useDispatch } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Input as InputStrap } from "reactstrap";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { doc, setDoc } from "firebase/firestore";
import {
  setAuthenticated,
  setToken,
  setUser,
} from "../../../Redux/Slices/AuthSlice";
const Signup = () => {
  const navigation = useNavigate();
  const [inputType, setInputType] = useState("password");
  const [confirmPass, setConfirmPass] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextScreen, setNextScreen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [UserImage, setsetUserImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [SelectedImg, setSelectedImg] = useState("");

  const dispatch = useDispatch();
  // snack bar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // all api

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setInputType(passwordVisible ? "password" : "text");
  };
  const HandleConfirmPass = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
    setConfirmPass(confirmPasswordVisible ? "password" : "text");
  };

  const initialValues = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().trim().required("username is required"),

    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const uploadImage = (courseFile) => {
    console.log(courseFile);
    if (!courseFile) return;
    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `UserImages/${uniqueFileName}`);
    uploadBytes(imageRef, courseFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setProfileImage(url);
      });
    });
  };

  const SelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImg(null);
    }
    if (file) {
      uploadImage(file);
    }
  };

  const handleSubmit = async (value) => {
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(
        auth,
        value?.email?.toLowerCase()?.trim(),
        value?.password
      );
      await setDoc(doc(firestore, "users", res?.user?.uid), {
        userImage: profileImage,
        userName: value?.username,
        email: value?.email,
        musics: [],
        userId: res?.user?.uid,
      });
      dispatch(setToken(res?.user?.uid));
      dispatch(setUser({ ...value, musics: [], userImage: profileImage }));
      dispatch(setAuthenticated(true));
      navigation("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        showSnackbar("Email already in use by another account");
      }
      if (error.code === "auth/too-many-requests") {
        showSnackbar("Too many request");
      }
      if (error.code === "auth/network-request-failed") {
        showSnackbar("Request failed please try again");
      }
      console.log("================SignupError", error.code, error.message);
    }
  };
  // setData(values);
  // setNextScreen(true);

  return (
    <>
      <CustomSnackbar
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
          handleSubmit,
          setFieldValue,
        }) => (
          <Form className="formHead" onSubmit={handleSubmit}>
            <h5 className="loginHead text-center mt-4 mb-4">Create Account</h5>
            <section className="bord">
              <h5 className="registerText mb-3">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our privacy policy.
              </h5>

              <section>
                {/* <div className="flex_center">
                  <InputStrap
                    type="file"
                    required
                    id="fileInput"
                    className="visually-hidden"
                    onChange={SelectImage}
                  />
         
                </div> */}
                <div
                  className="d-flex justify-center align-items-center"
                  style={{ flexDirection: "column" }}
                >
                  <h6 className="lableHead mt-2 mb-2">Upload Profile</h6>
                  <div>
                    <label
                      style={{ cursor: "pointer" }}
                      htmlFor="fileInput"
                      className="cursor-pointer"
                    >
                      {SelectedImg ? (
                        <img
                          src={SelectedImg}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                          className="object-cover"
                        />
                      ) : (
                        <div className="border radius_50 flex justify-center items-center">
                          <img
                            src={fileavatar}
                            alt="Camera Icon"
                            width={80}
                            height={80}
                          />
                        </div>
                      )}
                    </label>

                    <InputStrap
                      type="file"
                      required
                      id="fileInput"
                      className="visually-hidden"
                      onChange={SelectImage}
                    />
                  </div>
                </div>

                <Form.Group
                  className="mb-2 hideFocus2"
                  controlId="formGroupEmail"
                >
                  <Form.Label className="lableHead">User name</Form.Label>
                  <Form.Control
                    className="radius_12"
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                  />
                  {touched.username && errors.username && (
                    <div className="errorMsg">{errors.username}</div>
                  )}
                </Form.Group>
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

                <Form.Group
                  className="mb-2 hideFocus2"
                  controlId="formGroupPassword"
                >
                  <Form.Label className="lableHead">
                    Confirm Password
                  </Form.Label>
                  <div className="d-flex align-items-center position-relative">
                    <Form.Control
                      className="radius_12"
                      type={confirmPass}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                    />
                    <img
                    
                      className="pass_img"
                      src={confirmPasswordVisible ? openEye : closeEye}
                      alt=""
                      onClick={HandleConfirmPass}
                    />
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="errorMsg">{errors.confirmPassword}</div>
                  )}
                </Form.Group>
                <button
                  disabled={loading}
                  className={`loginBtn w-100 mt-3 ${
                    loading ? "disbalebtn" : ""
                  }`}
                  type="submit"
                >
                  {loading ? (
                    <Spinner
                      style={{
                        width: "20px",
                        height: "20px",
                        marginTop: "3px",
                        borderWidth: "0.15em",
                      }}
                      animation="border"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </section>

              {/* ended */}
            </section>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;
