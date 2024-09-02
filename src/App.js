/* eslint-disable no-unused-vars */
import "./App.css";
import Header from "./Components/Navbar/Header";
import Router from "./Routes/Router";
import "./assets/css/style.css";
import "./assets/css/query.css";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Initialize react-toastify

import "./assets/css/Animation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

// import "swiper/css";
// import "swiper/css/free-mode";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
import SideBar from "./Components/Screen/SideBar/SideBar";

function App() {
  return (
    <div className="App">
      <SideBar />
    </div>
  );
}

export default App;
