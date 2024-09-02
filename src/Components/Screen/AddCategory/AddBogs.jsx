/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";

import { auth, firestore, storage } from "../../Firebase/Config";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { Input as InputStrap } from "reactstrap";
import { v4 as uuidv4 } from "uuid";

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
const AddBogs = () => {
  const navigation = useNavigate();

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
      const categoryCollection = collection(
        firestore,
        "BlogCategoryCollection"
      );

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
    url: Yup.string().required("Feed url is required"),
  });

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      // Fetch the category object by categoryId
      const categoryDocRef = doc(
        firestore,
        "BlogCategoryCollection",
        value?.cat
      );
      const categoryDoc = await getDoc(categoryDocRef);

      if (!categoryDoc.exists()) {
        setLoading(false);
        throw new Error("Category not found");
      }

      const categoryData = categoryDoc.data();
      const uniqueId = uuidv4();

      // Reference to the 'channels' collection
      const channelsCollection = collection(firestore, "BlogCollection");

      // Add a new document with the channel details, including the category object
      const docRef = await addDoc(channelsCollection, {
        _id: uniqueId,
        url: value?.url,
        category: categoryData, // Including the full category object
        sub: [],
        download: [],
        star: [],
      });

      navigation("/BlogList");

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
                <Form.Label className="lableHead">Add Blog Category</Form.Label>
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

export default AddBogs;
