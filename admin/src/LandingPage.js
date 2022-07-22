import React, { useState } from "react";
import "./App.css";
//import Home1 from "./components/pages/Home";
import evt from "./components/components/Events";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";

const instaImg = {
  backgroundImage: "url(./images/main_bg.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};



function LandingPage(props) {
  // evt.setMaxListeners(1);

  const connectWalletEvent = () => {
    //console.log("events are---->",evt)
    props.connectWallet()
    //evt.emit("wallet-connect");

  };

  return (
    <div className='wrapper landing'>
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
