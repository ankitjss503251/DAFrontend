import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Wallet from "./SVG/Wallet";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import {
  checkuseraddress,
  getProfile,
  Login,
  Logout,
  adminRegister,
  isSuperAdmin,
  logoutSuperAdmin,
} from "./../apiServices";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useCookies } from "react-cookie";
import { slowRefresh } from "./../helpers/NotifyStatus";
import Logo from "./../logo.svg";
import PopupModal from "./components/popupModal";
import evt from "./components/Events";
import init from "@web3-onboard/core";
import LandingPage from "../LandingPage";

const Web3 = require('web3');
// web3 lib instance
const web3 = new Web3(window.ethereum);


const injected = injectedModule();
const walletConnect = walletConnectModule();
 

const onboard = Onboard({
  wallets: [walletConnect, injected],

  chains: [
    {
      id: "0x13881",
      token: "MATIC",
      label: "Mumbai matic testnet",
      rpcUrl: `https://rpc-mumbai.matic.today/`,
    },
    // {
    //   id: "0x1",
    //   token: "ETH",
    //   label: "Ethereum Mainnet",
    //   rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
    // },
    // {
    //   id: "0x3",
    //   token: "tROP",
    //   label: "Ethereum Ropsten Testnet",
    //   rpcUrl: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
    // },
    {
      id: "0x4",
      token: "rETH",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: `https://rinkeby.infura.io/v3/59c3f3ded6a045b8a92d1ffb5c26e91f`,
    },
    {
      id: "0x38",
      token: "BNB",
      label: "Binance Smart Chain",
      rpcUrl: "https://bsc-dataseed.binance.org/",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Matic Mainnet",
      rpcUrl: "https://matic-mainnet.chainstacklabs.com",
    },
    {
      id: "0x61",
      token: "BNB",
      label: "Binance Testnet",
      rpcUrl: "https://data-seed-prebsc-2-s2.binance.org:8545/",
    },
  ],
  appMetadata: {
    name: "DigitalArms",
    icon: Logo,
    logo: Logo,
    description: "DigitalArms using Onboard",
    // agreement: {
    //   version: "1.0.0",
    //   termsUrl: "https://www.blocknative.com/terms-conditions",
    //   privacyUrl: "https://www.blocknative.com/privacy-policy",
    // },
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
    ],
  },
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: "Available Wallets",
        },
      },
    },
  },

  accountCenter: {
    desktop: {
      enabled: false,
    },
  },
});


evt.removeAllListeners("wallet-connect", walletConnect);


const Navbar = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [isChainSwitched, setIsChainSwitched] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [label, setLabel] = useState("");


  useEffect(() => {
    init();
    console.log('rendered');
  }, []);
  const init = async () => {
    if (cookies["da_selected_account"]) {
      setAccount(cookies["da_selected_account"]);
      const s = await onboard.connectWallet({
        autoSelect: { label: cookies["label"], disableModals: true },
      });
      await onboard.setChain({
        chainId: process.env.REACT_APP_CHAIN_ID,
      });
      setProvider(s[0].provider);
      setLabel(s[0].label);
      setCookie("label", s[0].label, { path: "/" });
      setCookie("da_selected_account", s[0].accounts[0].address, { path: "/" });
      setCookie("chain_id", parseInt(s[0].chains[0].id, 16).toString(), {
        path: "/",
      });
      setCookie("balance", s[0].accounts[0].balance, { path: "/" });


    }
  };

  const refreshState = () => {
    removeCookie("da_selected_account", { path: "/" });
    removeCookie("chain_id", { path: "/" });
    removeCookie("balance", { path: "/" });
    removeCookie("label", { path: "/" });
    localStorage.clear();
    setAccount("");
    setChainId("");
    setProvider(null);
  };

  function walletConnect() {
    connectWallet();
  }

  const getUserProfile = async () => {
    const profile = await getProfile();
    setUserDetails(profile.data);
  };

  const connectWallet = async () => {

    if (window.ethereum) {
      console.log("window ethereum");
    } else {
      NotificationManager.error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    console.log("in connect wallet");
    const wallets = await onboard.connectWallet();

    if (wallets.length !== 0) {
      await onboard.setChain({
        chainId: process.env.REACT_APP_CHAIN_ID,
      });
      const primaryWallet = wallets[0];
      setChainId(primaryWallet.chains[0].id);
      console.log("provider", primaryWallet.provider);
      setProvider(primaryWallet.provider);
      const address = primaryWallet.accounts[0].address;


      if (web3.eth) {
        const timestamp = new Date().getTime();
        const message = `Digital Arms Marketplace uses this cryptographic signature in place of a password, verifying that you are the owner of this Ethereum address - ${timestamp}`;

        console.log(web3.utils.fromUtf8(message));

        web3.eth.currentProvider.sendAsync({
          method: 'personal_sign',
          params: [message, address],
          from: address,
        }, async function (err, signature) {
          if(!err){
            console.log("Signature", signature);
            try {
              userAuth(primaryWallet, address, signature.result, message);
            } catch (e) {
              console.log("Error in user auth", e);
            }
          }
          console.log("Error is", err);
        })
      }

      // try {
      //   userAuth(primaryWallet, address);
      // } catch (e) {
      //   console.log("Error in user auth", e);
      // }
    }
  };

  const userAuth = async (primaryWallet, address, signature, message) => {
    try {
      const isUserExist = await checkuseraddress(address);
      if (isUserExist?.message !== "User not found") {

        try {
          const res = await Login(address, signature, message);
          console.log("Login API response", res);
          if (res?.message === "Wallet Address required") {
            NotificationManager.info(res?.message);
            return;
          } else if (
            res?.message === "User not found" ||
            res?.message === "Login Invalid"
          ) {
            NotificationManager.error(res?.message);
            return;
          } else {
            setAccount(primaryWallet.accounts[0].address);

            setLabel(primaryWallet.label);
            window.sessionStorage.setItem("role", res?.data?.userType);
            setCookie("da_selected_account", address, { path: "/" });
            setCookie("label", primaryWallet.label, { path: "/" });
            setCookie(
              "chain_id",
              parseInt(primaryWallet.chains[0].id, 16).toString(),
              {
                path: "/",
              }
            );
            setCookie("balance", primaryWallet.accounts[0].balance, {
              path: "/",
            });
            getUserProfile();
            NotificationManager.success(res?.message);
            slowRefresh(1000);
            return;
          }
        } catch (e) {
          NotificationManager.error("Something went wrong", "", 800);
          return;
        }
      }
      else {
        NotificationManager.error("Wallet is not added as admin", "", 800);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const disconnectWallet = async () => {
    await onboard.disconnectWallet({ label: label });
    await Logout(cookies["da_selected_account"]);
    window.sessionStorage.removeItem("role");
    refreshState();
    NotificationManager.success("User Logged out Successfully", "", 800);
    slowRefresh(1000);
  };

  if (!account && !isSuperAdmin()) {
    return <LandingPage connectWallet={connectWallet} />
  }

  return (


    <div className="admin-navbar d-flex w-100">
      {isChainSwitched ? (
        <PopupModal
          content={
            <div className="switch_container">
              <h3>Chain Switched</h3>
              <p className="my-4 mr-2">
                Please Switch to Matic Testnet Network
              </p>
              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="btn network_btn"
                  onClick={async () => {
                    await onboard.setChain({
                      chainId: process.env.REACT_APP_CHAIN_ID,
                    });
                    setIsChainSwitched(false);
                  }}
                >
                  Switch Network
                </button>
              </div>
            </div>
          }
          handleClose={() => setIsChainSwitched(false)}
        />
      ) : (
        ""
      )}
      <div className="profile_box text-light me-auto d-flex align-items-center text-uppercase montserrat font-400">
        <div className="profile_img">
          <img src={"../images/user.jpg"} alt="" className="img-fluid" />
        </div>
        {props.model}
        <Link className="logo" to="/">
          Digital Arms
        </Link>
      </div>
      <ul className="p-0 m-0">
        {/* <li className='text-light'>
          <div className='position-relative'>
            <Message />
            <span className='badge badge-danger navbar-badge text-dark'>3</span>
          </div>
        </li>
        <li className='text-light'>
          <div className='position-relative'>
            <Notification />
            <span className='badge badge-danger navbar-badge text-dark'>3</span>
          </div>
        </li> */}
        <li>
          {isSuperAdmin() ? (
            <button
              className="round-btn montserrat text-light text-decoration-none"
              onClick={logoutSuperAdmin}
            >
              {"Logout"}
            </button>
          ) : (
            <button
              className="round-btn montserrat text-light text-decoration-none"
              onClick={!account ? connectWallet : disconnectWallet}
            >
              {!account ? (
                "Connect Wallet"
              ) : (
                <>
                  <Wallet />
                  {account.slice(0, 4) + "..." + account.slice(38, 42)}
                </>
              )}
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default React.memo(Navbar);
