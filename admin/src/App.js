import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./App.css";
import Home1 from "./components/pages/Home";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import CreateCollection1 from "./components/pages/CreateCollection";
import CreateNFTs1 from "./components/pages/CreateNFTs";
import Rightarrow from "./components/SVG/rightarrow";
import CreateBrands1 from "./components/pages/CreateBrands";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import CreateCategories1 from "./components/pages/CreateCategories";
import NotificationPopup from "./components/components/NotificationPopup";
import Admins1 from "./components/pages/admins";
import { NotificationContainer } from "react-notifications";
import NftDetail from "./components/pages/ImportedData/nftDetail";
import withLogin from "./components/components/withLogin";

import Navbar from "./components/Navbar";
import LandingPage from "./LandingPage";
import { isSuperAdmin } from "./apiServices";

const Home = withLogin(Home1);
const Admins = withLogin(Admins1);
const CreateCategories = withLogin(CreateCategories1);
const CreateBrands = withLogin(CreateBrands1);
const CreateCollection = withLogin(CreateCollection1);
const CreateNFTs = withLogin(CreateNFTs1);

const instaImg = {
  backgroundImage: "url(./images/main_bg.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

function App() {
  const [mode, setMode] = useState("Darkmode");
  const [notificationpopup, setNotificationPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies([]);

  const showNotificationPopup = (message, title) => {
    setNotificationPopup({
      msg: message,
      tlt: title,
    });
    setTimeout(() => {
      setNotificationPopup(null);
    }, 2000);
  };

  const toggleMode = () => {
    if (mode === "Darkmode") {
      setMode("Lightmode");
    } else {
      setMode("Darkmode");
    }
  };


  useEffect(() => {
    if (cookies["da_selected_account"])
      setCurrentUser(cookies["da_selected_account"]);
  }, [cookies]);

  return (
    <div style={instaImg} className={mode}>
      <div className="btn_hidden">
        <div className="define_mode">
          <button type="button" onClick={toggleMode}>
            <Rightarrow />{" "}
            <span className="mode_text">
              {mode === "Darkmode" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>

      <BrowserRouter>
        <Routes>
          {/* <Route
            path="navbar"
            model={mode}
            element={<Navbar />}
            toggleMode={toggleMode}
          /> */}

          <Route path="sadmin" element={<Login />} />

          <Route
            element={<>
              <Navbar />
              <Outlet />
            </>} >



            {currentUser || isSuperAdmin() ? <Route path="/" element={<Home />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="admins" element={<Admins />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="createcollection" element={<CreateCollection />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="createnfts" element={<CreateNFTs />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="createbrands" element={<CreateBrands />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="login" element={<Login />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="register" element={<Register />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route path="importedNfts/:address/:id" element={<NftDetail />} /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route
              path="createcategories"
              showNotificationPopup={() => { }}
              element={<CreateCategories />}
            /> : <Route path="/" />}

            {currentUser || isSuperAdmin() ? <Route
              path="notificationpopup"
              notificationpopup={notificationpopup}
              element={<NotificationPopup />}
            /> : <Route path="/" />}
          </Route>



        </Routes>

        <NotificationContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;