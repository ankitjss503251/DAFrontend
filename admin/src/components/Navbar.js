import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Wallet from "./SVG/Wallet";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import Logo from "./../user.jpg"
import walletConnectModule from "@web3-onboard/walletconnect";
import {
  checkuseraddress,
  getProfile,
  Login,
  Logout,
  isSuperAdmin,
  logoutSuperAdmin,
  CheckIfBlocked,
} from "./../apiServices";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useCookies } from "react-cookie";
import { slowRefresh } from "./../helpers/NotifyStatus";
import evt from "../events/events";
import LandingPage from "../LandingPage";
var CryptoJS = require("crypto-js");

const Web3 = require('web3');
// web3 lib instance
const web3 = new Web3(window.ethereum);


const injected = injectedModule();
const walletConnect = walletConnectModule();


export const onboard = Onboard({
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





const Navbar = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [userDetails, setUserDetails] = useState();
  const [label, setLabel] = useState("");
  const [isBlocked, setIsBlocked] = useState(false)



  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (cookies.da_selected_account || account) {
        let res = await CheckIfBlocked({ "walletAddress": account ? account : cookies.da_selected_account })
        if (res === false) {
          window.sessionStorage.setItem("role", "admin")
        }
        setIsBlocked(res)
      }
    }
    fetch()
  }, [account, cookies.da_selected_account])

  const init = async () => {
    console.log("init")
    if (cookies["da_selected_account"]) {
      setAccount(cookies["da_selected_account"]);
      const s = await onboard.connectWallet({
        autoSelect: { label: cookies["da_label"], disableModals: true },
      });
    }
  };

  const refreshState = () => {
    removeCookie("da_selected_account", { path: "/" });
    // removeCookie("da_chain_id", { path: "/" });
    removeCookie("balance", { path: "/" });
    removeCookie("da_label", { path: "/" });
    localStorage.clear();
    setAccount("");
    setChainId("");
    setProvider(null);
  };

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
    const wallets = await onboard.connectWallet();

    if (wallets.length !== 0) {
      const chain = await onboard.setChain({
        chainId: process.env.REACT_APP_CHAIN_ID,
      });
    
      if(chain){
      const primaryWallet = wallets[0];
      const address = primaryWallet.accounts[0].address;


      if (web3.eth) {
        const siteUrl = process.env.REACT_APP_SITE_URL;
        let nonce = "";
        await web3.eth.getTransactionCount(address).then(async (result) => {
          console.log("encryptedData", result)
          nonce = CryptoJS.AES.encrypt(JSON.stringify(result), 'DASecretKey').toString();
          console.log("encryptedData", nonce)
        })
        const message = `Welcome to Digital Arms!\n\nClick to sign in and accept the Digital Arms Terms of Service: ${siteUrl}/\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${address}\n\nNonce:\n${nonce}`;

        console.log(web3.utils.fromUtf8(message));

        web3.eth.currentProvider.sendAsync({
          method: 'personal_sign',
          params: [message, address],
          from: address,
        }, async function (err, signature) {
          if (!err) {
            console.log("Signature", signature);
            try {
              userAuth(primaryWallet, address, signature.result, message);
            } catch (e) {
              console.log("Error in user auth", e);
            }
          }
          console.log("Error is", err);
          // window.location.reload()
        })
      }
    }
    else{
      NotificationManager.error("Please switch Network","",800)
      await onboard.disconnectWallet({ label: "MetaMask" });
      return;
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
          } else
            if (res?.message === "Admin Account is blocked") {
              NotificationManager.error(res?.message);
              return;
            }
            else {
              setAccount(primaryWallet.accounts[0].address);
              setLabel(primaryWallet.label);
              window.sessionStorage.setItem("role", res?.data?.userType);
              setCookie("da_selected_account", address, { path: "/" });
              setCookie("da_label", primaryWallet.label, { path: "/" });
              // setCookie(
              //   "da_chain_id",
              //   primaryWallet.chains[0].id,
              //   {
              //     path: "/",
              //   }
              // );
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
    await onboard.disconnectWallet({ label: cookies["da_label"] });
    await Logout(cookies["da_selected_account"]);
    window.sessionStorage.removeItem("role");
    refreshState();
    window.location.href = "/"
    // NotificationManager.success("User Logged out Successfully", "", 800);
    // slowRefresh(1000);
  };

  evt.setMaxListeners(1)
  evt.removeAllListeners("disconnectWallet");
  evt.on("disconnectWallet", () => {
    disconnectWallet()
  });
  evt.removeAllListeners("connectWallet");
  evt.on("connectWallet", () => {
    connectWallet()
  });

  if ((!cookies.da_selected_account && !isSuperAdmin()) || isBlocked) {
    return <LandingPage connectWallet={connectWallet} />
  }

  return (


    <div className="admin-navbar d-flex w-100">

      <div className="profile_box text-light me-auto d-flex align-items-center text-uppercase montserrat font-400">
        <div className="profile_img">
          <img src={Logo} alt="" className="img-fluid" />
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
                  {account?.slice(0, 4) + "..." + account?.slice(38, 42)}
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
