/* eslint-disable no-unused-vars */
import React from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { Form, Modal } from "react-bootstrap";

const FilterModal = ({ isOpen, onClose }) => {
  const categoryOptions = [
    { value: "German Shepherd", label: "German Shepherd" },
    { value: "Labrador Retriever", label: "Labrador Retriever" },
    { value: "Golden Retriever", label: "Golden Retriever" },
    { value: "Bulldog", label: "Bulldog" },
    { value: "Poodle", label: "Poodle" },
  ];

  const sizeOption = [
    { value: "Small", label: "Small" },
    { value: "Mini", label: "Mini" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Yellow" },
    { value: "Toy", label: "Toy" },
  ];

  const colorOption = [
    { value: "Red", label: "Red" },
    { value: "Blue", label: "Blue" },
    { value: "Green", label: "Green" },
    { value: "Yellow", label: "Yellow" },
    { value: "Purple", label: "Purple" },
  ];

  const breedOption = [
    { value: "Akita", label: "Akita" },
    { value: "Airedale Terrier", label: "Airedale Terrier" },
    { value: "Alaskan Klee Kai", label: "Alaskan Klee Kai" },
    { value: "American Bulldog", label: "American Bulldog" },
    { value: "Alaskan Malamute", label: "Alaskan Malamute" },
  ];

  const initialValues = {
    category: null,
    size: null,
    color: null,
    breed: null,
    priceTo: "",
    priceFrom: "",
  };

  const validationSchema = Yup.object().shape({
    category: Yup.object()
      .shape({
        value: Yup.string().required("Category is required"),
        label: Yup.string().required("Category is required"),
      })
      .nullable()
      .required("Category is required"),
    size: Yup.object()
      .shape({
        value: Yup.string().required("Size is required"),
        label: Yup.string().required("Size is required"),
      })
      .nullable()
      .required("Size is required"),
    color: Yup.object()
      .shape({
        value: Yup.string().required("Color is required"),
        label: Yup.string().required("Color is required"),
      })
      .nullable()
      .required("Color is required"),
    breed: Yup.object()
      .shape({
        value: Yup.string().required("Breed is required"),
        label: Yup.string().required("Breed is required"),
      })
      .nullable()
      .required("Breed is required"),
    priceFrom: Yup.number().required("Price From is required"),
    priceTo: Yup.number().required("Price To is required"),
  });

  //   submit data

  const handleSubmit = (values) => {
    const apiData = {
      name: values?.name,
    };
  };
  return (
    <>
      <Modal className="mymodal00" centered backdrop="static" show={isOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modalTitle">Filter Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              setFieldValue,
              handleBlur,
              handleSubmit,
            }) => (
              <Form className="w-100 formHead" onSubmit={handleSubmit}>
                <section className="sectionModal00">
                  <Form.Group className="mb-2 hideFocus2">
                    <Form.Label className="lableHead">Category</Form.Label>
                    <Select
                      className="basic-single radius_12 cutomSelect"
                      classNamePrefix="select"
                      value={values.category}
                      isClearable
                      name="category"
                      options={categoryOptions}
                      onChange={(selectedOption) =>
                        setFieldValue("category", selectedOption)
                      }
                    />

                    {touched.category && errors.category && (
                      <div className="errorMsg">{errors.category}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-2 hideFocus2">
                    <Form.Label className="lableHead">Size</Form.Label>
                    <Select
                      className="basic-single radius_12 cutomSelect"
                      classNamePrefix="select"
                      value={values.size}
                      isClearable
                      name="size"
                      options={sizeOption}
                      onChange={(selectedOption) =>
                        setFieldValue("size", selectedOption)
                      }
                    />

                    {touched.size && errors.size && (
                      <div className="errorMsg">{errors.size}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-2 hideFocus2">
                    <Form.Label className="lableHead">Color</Form.Label>
                    <Select
                      className="basic-single radius_12 cutomSelect"
                      classNamePrefix="select"
                      value={values.color}
                      isClearable
                      name="color"
                      options={colorOption}
                      onChange={(selectedOption) =>
                        setFieldValue("color", selectedOption)
                      }
                    />

                    {touched.color && errors.color && (
                      <div className="errorMsg">{errors.color}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-2 hideFocus2">
                    <Form.Label className="lableHead">Breed</Form.Label>
                    <Select
                      className="basic-single radius_12 cutomSelect"
                      classNamePrefix="select"
                      value={values.breed}
                      isClearable
                      name="breed"
                      options={breedOption}
                      onChange={(selectedOption) =>
                        setFieldValue("breed", selectedOption)
                      }
                    />

                    {touched.breed && errors.breed && (
                      <div className="errorMsg">{errors.breed}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-2 hideFocus2">
                    <Form.Label className="lableHead">Price</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        className="radius_12"
                        type="number"
                        placeholder="Price From"
                        name="priceFrom"
                        value={values.priceFrom}
                        onChange={handleChange}
                      />
                      <Form.Control
                        className="radius_12 ms-3"
                        type="number"
                        placeholder="Price To"
                        name="priceTo"
                        value={values.priceTo}
                        onChange={handleChange}
                      />
                    </div>
                    {touched.priceTo && errors.priceTo && (
                      <div className="errorMsg">{errors.priceTo}</div>
                    )}
                  </Form.Group>
                </section>

                {/* ended */}

                <div className="d-flex flex-column">
                  <button className="loginBtn mt-3">Submit</button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FilterModal;
