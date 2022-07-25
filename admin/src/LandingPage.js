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
      <div className="connect_wallet">
        <div className="connect_wallet_col">
          <img src="../images/logo.svg" className="img-fluid d-block" alt="" />
          <h4 class="text-light text-center font-24 text-uppercase font-700 my-4">Connect Your Wallet</h4>
          <button className='round-btn montserrat text-light text-decoration-none connect_wallet_btn mt-3' onClick={() => connectWalletEvent()}>
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
