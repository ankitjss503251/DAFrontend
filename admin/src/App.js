import React, { useState,Suspense } from "react";
import "./App.css";
import Home1 from "./components/pages/Home";
import { BrowserRouter, Routes, Route,Outlet } from "react-router-dom";
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
import Navbar from "./components/Navbar";
import withLogin from "./components/components/withLogin";

import Navbar from "./components/Navbar";

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

function App(props) {
  const [mode, setMode] = useState("Darkmode");
  const [notificationpopup, setNotificationPopup] = useState(null);
  const [isAdminLogin,setIsAdminLogin] = useState();
  // const showNotificationPopup = (message, title) => {
  //   setNotificationPopup({
  //     msg: message,
  //     tlt: title,
  //   });
  //   // setTimeout(() => {
  //   //   setNotificationPopup(null);
  //   // }, 2000);
  // };

  const toggleMode = () => {
    if (mode === "Darkmode") {
      setMode("Lightmode");
    } else {
      setMode("Darkmode");
    }
  };

  return (
    <div style={instaImg} className={mode}>
      <div className="btn_hidden">
        <div className="define_mode">
          <button type="button" onClick={()=>{}}>
            <Rightarrow />{" "}
            <span className="mode_text">
              {mode === "Darkmode" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
      <Suspense fallback={null}>
      <BrowserRouter>
<<<<<<< HEAD
       
        <Routes>
          <Route path="sadmin" element={<Login />} />
          <Route element={<><Navbar /><Outlet/></>}>  
          <Route path="/" element={<Home />} />
=======
        <Routes>
>>>>>>> bdaf2ff5ab051c8f1c6a943b4d3272b2cdd78d21
          {/* <Route
            path="navbar"
            model={mode}
            element={<Navbar />}
            toggleMode={toggleMode}
          /> */}
<<<<<<< HEAD
          <Route path="admins" element={<Admins />}></Route>
          <Route path="createcollection" element={<CreateCollection />} />
          <Route path="createnfts" element={<CreateNFTs />} />
          <Route path="createbrands" element={<CreateBrands />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="importedNfts/:address" element={<ImportCard />} />
          <Route path="importedNfts/:address/:id" element={<NftDetail />} />
          <Route
            path="createcategories"
            showNotificationPopup={()=>{}}
            element={<CreateCategories />}
          />
          <Route
            path="notificationpopup"
            notificationpopup={notificationpopup}
            element={<NotificationPopup />}
          />
=======

          <Route path="sadmin" element={<Login />} />

          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<Home />} />
            {/* <Route

     path="navbar"

            model={mode}

            element={<Navbar />}

            toggleMode={toggleMode}

          /> */}

            <Route path="admins" element={<Admins />}></Route>

            <Route path="createcollection" element={<CreateCollection />} />

            <Route path="createnfts" element={<CreateNFTs />} />

            <Route path="createbrands" element={<CreateBrands />} />

            <Route path="login" element={<Login />} />

            <Route path="register" element={<Register />} />

            <Route path="importedNfts/:address/:id" element={<NftDetail />} />

            <Route
              path="createcategories"
              showNotificationPopup={() => {}}
              element={<CreateCategories />}
            />

            <Route
              path="notificationpopup"
              notificationpopup={notificationpopup}
              element={<NotificationPopup />}
            />
>>>>>>> bdaf2ff5ab051c8f1c6a943b4d3272b2cdd78d21
          </Route>
        </Routes>

        <NotificationContainer />
      </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
