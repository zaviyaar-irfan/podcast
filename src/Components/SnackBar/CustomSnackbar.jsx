import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CustomSnackbar = ({ open, message, severity, onClose }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(open);

  useEffect(() => {
    setSnackbarOpen(open);
  }, [open]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    onClose(); // Call the parent component's onClose function
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      className="snac00"
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;

// use snackbar with this

// const [snackbarOpen, setSnackbarOpen] = useState(false);
// const [snackbarMessage, setSnackbarMessage] = useState("");
// const [snackbarSeverity, setSnackbarSeverity] = useState("info");

// //

// const handleSnackbarClose = () => {
//   setSnackbarOpen(false);
// };
// const showSnackbar = (message, severity) => {
//   setSnackbarMessage(message);
//   setSnackbarSeverity(severity);
//   setSnackbarOpen(true);
// };

// // user this inside components

// <CustomSnackbar
// open={snackbarOpen}
// message={snackbarMessage}
// severity={snackbarSeverity}
// onClose={handleSnackbarClose}
// />

// // this is msg
// showSnackbar(resp?.message, "success");
