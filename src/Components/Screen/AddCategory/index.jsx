/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import closeEye from "../../../assets/icon/close_eye.svg";
import openEye from "../../../assets/icon/open_eye.svg";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
// import { setToken } from "../../../store/reducer/AuthConfig";
import { ToastMessage } from "../../../utils/ToastMessage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage } from "../../Firebase/Config";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { Input as InputStrap } from "reactstrap";
import { v4 as uuidv4 } from "uuid";

import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

import { message } from "antd";

import { useDispatch } from "react-redux";
import {
  setAuthenticated,
  setToken,
  setUser,
} from "../../../Redux/Slices/AuthSlice";
import { getSingleDoc } from "../../Firebase/FirbaseService";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DataTable from "react-data-table-component";
import ImageLoader from "../../ImageLoader/ImageLoader";
const AddCat = () => {
  const navigation = useNavigate();
  // const [state, setState] = React.useState({
  //   open: false,
  //   vertical: "top",
  //   horizontal: "center",
  // });

  const [inputType, setInputType] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [Cat, setCat] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [SelectedImg, setSelectedImg] = useState("");
  const [Chanalsdata, setChanalsdata] = useState([]);
  const [channelLoading, setChannelLoading] = useState(false);
  const [loadingupload, setloadingupload] = useState(false);

  const getCategories = async () => {
    try {
      // Reference to the 'category' collection
      const categoryCollection = collection(firestore, "category");

      // Fetch all documents in the collection
      const categorySnapshot = await getDocs(categoryCollection);

      // Extract data from each document
      const categories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Log and return the categories
      setCat(categories);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
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
    cat: "",
    title: "",
    url: "",
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required("Category name is required"),
    title: Yup.string().required("Title is required"),
    url: Yup.string().required("Feed url is required"),
  });

  useEffect(() => {
    getCategories();
  }, []);

  const uploadImage = (courseFile) => {
    if (!courseFile) return;
    setloadingupload(true);

    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `UserImages/${uniqueFileName}`);
    uploadBytes(imageRef, courseFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        showSnackbar("Image Added Sucessfully", "success");
        setProfileImage(url);
        setloadingupload(false);
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
    setLoading(true);
    try {
      // Fetch the category object by categoryId
      const categoryDocRef = doc(firestore, "category", value?.cat);
      const categoryDoc = await getDoc(categoryDocRef);

      if (!categoryDoc.exists()) {
        setLoading(false);
        throw new Error("Category not found");
      }

      const categoryData = categoryDoc.data();
      const uniqueId = uuidv4();

      // Reference to the 'channels' collection
      const channelsCollection = collection(firestore, "Newchannels");

      // Add a new document with the channel details, including the category object
      const docRef = await addDoc(channelsCollection, {
        _id: uniqueId,
        title: value?.title,
        imageUrl: profileImage,
        url: value?.url,
        category: categoryData, // Including the full category object
        sub: [],
        download: [],
        star: [],
      });

      navigation("/listCategory");

      showSnackbar("Podcast Added Sucessfully", "success");

      setLoading(false);

      return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding channel:", error);
      throw error;
    }
  };

  // /

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
          <Form
            className="formHead"
            style={{ width: "40%" }}
            onSubmit={handleSubmit}
          >
            <section className="bord">
              <Form.Group
                className="mb-2 hideFocus2"
                controlId="formGroupEmail"
              >
                <Form.Label className="lableHead">Add Category</Form.Label>
                {/* <Form.Control
                  className="radius_12"
                  placeholder="Enter name"
                  name="cat"
                  value={values.cat}
                /> */}

                <Form.Select
                  aria-label="Default select example"
                  className="radius_12"
                  name="cat"
                  value={values.cat}
                  onChange={handleChange}
                >
                  {Cat.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>

                {touched.cat && errors.cat && (
                  <div className="errorMsg">{errors.cat}</div>
                )}

                <Form.Label className="lableHead mt-3">Add Title</Form.Label>

                <Form.Control
                  className="radius_12 "
                  placeholder="Title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                />
                {touched.title && errors.title && (
                  <div className="errorMsg">{errors.title}</div>
                )}

                <Form.Label className="lableHead mt-3">Add Feed Url</Form.Label>
                <Form.Control
                  className="radius_12 "
                  placeholder="Url"
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                />
                {touched.url && errors.url && (
                  <div className="errorMsg">{errors.url}</div>
                )}
              </Form.Group>

              <div className="d-flex " style={{ flexDirection: "column" }}>
                <h6 className="lableHead mt-2 mb-2">Upload Image</h6>
                <div>
                  <label
                    style={{ cursor: "pointer", position: "relative" }}
                    htmlFor="fileInput"
                    className="cursor-pointer"
                  >
                    {loadingupload && (
                      <Spinner
                        style={{
                          width: "18px",
                          height: "18px",
                          marginTop: "3px",
                          borderWidth: "0.15em",
                          position: "absolute",
                          top: "1.5rem",
                          right: "2rem",
                          zIndex: "99999",
                          color: "red",
                        }}
                        animation="border"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    )}
                    {profileImage ? (
                      <>
                        <img
                          src={profileImage}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            position: "relative",
                          }}
                          className="object-cover"
                        />
                      </>
                    ) : (
                      <div className="border radius_50 flex justify-content-center items-center">
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
                    // required
                    id="fileInput"
                    className="visually-hidden"
                    onChange={SelectImage}
                  />
                </div>
              </div>

              <div className="d-flex flex-column w-50">
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
                    "Submit"
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

export default AddCat;
