import React, { useState } from "react";
import "./App.css";
//import Home1 from "./components/pages/Home";
import evt from "./components/components/Events";

const instaImg = {
  backgroundImage: "url(./images/main_bg.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};


evt.setMaxListeners(1);
function LandingPage() {
  
  const connectWalletEvent = () => {
    evt.emit("wallet-connect");
  };

  return (
    <div className='wrapper'>
      <div id='content'>
        <div className='boxrow row'>
          <div className='col-md-12 text-center'>
            <button className='round-btn montserrat text-light text-decoration-none' onClick={() => connectWalletEvent()}>
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
