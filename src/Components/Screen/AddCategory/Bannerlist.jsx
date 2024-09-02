/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Form, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ImageLoader from "../../ImageLoader/ImageLoader";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Input as InputStrap } from "reactstrap";

import { auth, firestore, storage } from "../../Firebase/Config";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import CustomSnackbar from "../../SnackBar/CustomSnackbar";

import fileavatar from "../../../assets/images/profileavatar.jpg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Bannerlist = () => {
  const [channelLoading, setChannelLoading] = useState(false);
  const [Chanalsdata, setChanalsdata] = useState([]);
  const [Editmodal, setEditmodal] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [Cat, setCat] = useState([]);
  const [RowID, setRowID] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [SelectedImg, setSelectedImg] = useState("");
  const [Rowdata, setRowdata] = useState("");
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

  const getChannelsWithCategories = async () => {
    setChannelLoading(true);
    try {
      const channelsCollection = collection(firestore, "BannersCollection");
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(channels);

      setChanalsdata(channels);
      setChannelLoading(false);
    } catch (error) {
      console.error("Error fetching channels with categories:", error);
      setChannelLoading(false);
      throw error;
    }
  };

  const getCategoryIDByName = (name) => {
    const category = Cat.find((category) => category.name === name);
    return category?.id;
  };

  const initialValues = {
    cat: getCategoryIDByName(Rowdata?.category?.name),
    url: Rowdata?.url,
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required("Category name is required"),
    url: Yup.string().required("Feed url is required"),
  });

  const handleDelete = async (id) => {
    try {
      const channelRef = collection(firestore, "BannersCollection");
      await deleteDoc(doc(channelRef, id));
      // After deletion, refresh data
      getChannelsWithCategories();
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Fetch the category object by categoryId

      // Reference to the 'channels' collection
      const channelsCollection = collection(firestore, "BannersCollection");

      let docRef;

      if (RowID) {
        // Update the existing document
        docRef = doc(firestore, "BannersCollection", RowID);
        await updateDoc(docRef, {
          imageUrl: profileImage,
          download: [],
          star: [],
        });
        setEditmodal(false);
        getChannelsWithCategories();
        showSnackbar("Podcast Updated Successfully", "success");
      }

      return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding or updating channel:", error);
      throw error;
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleEdit = (row) => {
    setRowdata(row);
    setRowID(row?.id);
    setProfileImage(row?.imageUrl);
    setEditmodal(true);
  };

  const handleCancel = () => {
    setEditmodal(false);
  };

  useEffect(() => {
    getChannelsWithCategories();
    getCategories();
  }, []);

  const columns = [
    {
      name: "#",
      selector: (row, index) => index,
      maxWidth: "7rem",
      minWidth: "2rem",
    },

    {
      name: "Image",
      selector: (row) => (
        <ImageLoader
          classes={"tableImg"}
          imageUrl={row?.imageUrl}
          circeltrue={true}
        />
      ),
      maxWidth: "50rem",
      minWidth: "2rem",
    },

    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="loginBtn2"
            style={{ cursor: "pointer", padding: "2px 10px" }}
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="loginBtn2"
            style={{ cursor: "pointer", padding: "2px 10px", marginLeft: 20 }}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </>
      ),
      maxWidth: "10rem",
      minWidth: "10rem",
    },
  ];
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <Modal footer={false} open={Editmodal} centered onCancel={handleCancel}>
        <section className="formHead">
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
                      top: "2rem",
                      right: "2.5rem",
                      zIndex: "99999",
                      color: "white",
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
              onClick={handleSubmit}
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
      </Modal>

      {channelLoading ? (
        <div className="text-center">
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
        </div>
      ) : (
        <DataTable columns={columns} data={Chanalsdata} pagination />
      )}
    </>
  );
};

export default Bannerlist;
