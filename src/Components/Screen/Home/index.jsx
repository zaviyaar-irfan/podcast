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
import { auth, firestore } from "../../Firebase/Config";
import { useDispatch } from "react-redux";
import {
  setAuthenticated,
  setToken,
  setUser,
} from "../../../Redux/Slices/AuthSlice";
import { getSingleDoc } from "../../Firebase/FirbaseService";
import { addDoc, collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [inputType, setInputType] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [Cat, setCat] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setInputType(passwordVisible ? "password" : "text");
  };

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
  useEffect(() => {
    getCategories();
  }, []);

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
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required("Category name is required"),
  });

  // handle submit

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      // Reference to the 'category' collection
      const categoryCollection = collection(firestore, "category");

      // Add a new document with a generated ID
      const docRef = await addDoc(categoryCollection, {
        name: value.cat,
      });
      showSnackbar("Added Sucessfully", "success");
      // Log the ID of the new document
      console.log("Category added with ID:", docRef.id);
      setLoading(false);
      getCategories();
      // Return the document ID for later use
      return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding category", error);
      throw error;
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
                <Form.Control
                  className="radius_12"
                  placeholder="Enter name"
                  name="cat"
                  value={values.cat}
                  onChange={handleChange}
                />
                {touched.cat && errors.cat && (
                  <div className="errorMsg">{errors.cat}</div>
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

      <Table striped bordered hover className="mt-5" style={{ width: "70%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Cat Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Cat.map((user, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td colSpan={1}>{user.name}</td>
              <td colSpan={1}>
                <button
                  className="loginBtn2"
                  style={{ cursor: "pointer", padding: "2px 10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Home;
