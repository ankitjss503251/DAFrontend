import React, { useState, useEffect } from "react";
import Message from "./SVG/Message";
import Notification from "./SVG/Notification";
import Wallet from "./SVG/Wallet";
import { Link } from "react-router-dom";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import {
  checkuseraddress,
  getProfile,
  Login,
  Logout,
  adminRegister,
} from "./../apiServices";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useCookies } from "react-cookie";
import { slowRefresh } from "./../helpers/NotifyStatus";
import Logo from "./../logo.svg";
import PopupModal from "./components/popupModal";

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

const Navbar = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [isChainSwitched, setIsChainSwitched] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [label, setLabel] = useState("");

  useEffect(async () => {
    if (cookies["selected_account"]) {
      setAccount(cookies["selected_account"]);
      const s = await onboard.connectWallet({
        autoSelect: { label: cookies["label"], disableModals: true },
      });
      await onboard.setChain({
        chainId: process.env.REACT_APP_CHAIN_ID,
      });
      setProvider(s[0].provider);
      setLabel(s[0].label);
      setCookie("label", s[0].label, { path: "/" });
      setCookie("selected_account", s[0].accounts[0].address, { path: "/" });
      setCookie("chain_id", parseInt(s[0].chains[0].id, 16).toString(), {
        path: "/",
      });
      setCookie("balance", s[0].accounts[0].balance, { path: "/" });
    }
  }, []);

  const refreshState = () => {
    removeCookie("selected_account", { path: "/" });
    removeCookie("chain_id", { path: "/" });
    removeCookie("balance", { path: "/" });
    removeCookie("label", { path: "/" });
    localStorage.clear();
    setAccount("");
    setChainId("");
    setProvider(null);
  };

  useEffect(() => {
    console.log("provider in useEffect", provider);
    if (provider) {
      provider.on("accountsChanged", (accounts) => {
        const wallets = onboard.state.get().wallets;
        setProvider(wallets[0].provider);
        userAuth(wallets[0], wallets[0].accounts[0].address);
      });
      provider.on("chainChanged", (chains) => {
        console.log("chain changed", chains);
        if (chains !== process.env.REACT_APP_CHAIN_ID) {
          setIsChainSwitched(true);
        }
      });
    }
  }, [provider, account]);

  const getUserProfile = async () => {
    const profile = await getProfile();
    setUserDetails(profile.data);
  };

  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets.length !== 0) {
    await onboard.setChain({
      chainId: process.env.REACT_APP_CHAIN_ID,
    });
    const primaryWallet = wallets[0];
    setChainId(primaryWallet.chains[0].id);
    console.log("provider", primaryWallet.provider);
    setProvider(primaryWallet.provider);
    const address = wallets[0].accounts[0].address;
    try {
      userAuth(primaryWallet, address);
    } catch (e) {
      console.log("Error in user auth", e);
    }
  }
  };

  const userAuth = async (primaryWallet, address) => {
    try {
      const isUserExist = await checkuseraddress(address);
      if (isUserExist.message === "User not found") {
        try {
          const res = await adminRegister(address);
          const res2 = await Login(address);
          if (res.message === "Wallet Address required") {
            NotificationManager.info(res.message);
            return;
          } else if (res.message === "User already exists") {
            NotificationManager.error(res.message);
            return;
          } else {
            setAccount(primaryWallet.accounts[0].address);
            setLabel(primaryWallet.label);
            setCookie("selected_account", address, { path: "/" });
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
          NotificationManager.error(e);
          return;
        }
      } else {
        try {
          const res = await Login(address);
          console.log("Login API response", res);
          if (res.message === "Wallet Address required") {
            NotificationManager.info(res.message);
            return;
          } else if (
            res.message === "User not found" ||
            res.message === "Login Invalid"
          ) {
            NotificationManager.error(res?.message);
            return;
          } else {
            setAccount(primaryWallet.accounts[0].address);
            setLabel(primaryWallet.label);
            setCookie("selected_account", address, { path: "/" });
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
          NotificationManager.error(e);
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const disconnectWallet = async () => {
    await onboard.disconnectWallet({ label: label });
    await Logout(cookies["selected_account"]);
    refreshState();
    NotificationManager.success("User Logged out Successfully", "", 800);
    slowRefresh(1000);
  };

  return (
    <div className='admin-navbar d-flex w-100'>
      {isChainSwitched ? (
        <PopupModal
          content={
            <div className='switch_container'>
              <h3>Chain Switched</h3>
              <p className='my-4 mr-2'>
                Please Switch to Matic Testnet Network
              </p>
              <div className='d-flex justify-content-center align-items-center'>
                <button
                  className='btn network_btn'
                  onClick={async () => {
                    await onboard.setChain({
                      chainId: process.env.REACT_APP_CHAIN_ID,
                    });
                    setIsChainSwitched(false);
                  }}>
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
      <div className='profile_box text-light me-auto d-flex align-items-center text-uppercase montserrat font-400'>
        <div className='profile_img'>
          <img src={"../images/user.jpg"} alt='' className='img-fluid' />
        </div>
        {props.model}
        <a className="logo" href='/'>Digital Arms</a>
      </div>
      <ul className='p-0 m-0'>
        <li className='text-light'>
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
        </li>
        <li>
          <button
            className='round-btn montserrat text-light text-decoration-none'
            onClick={!account ? connectWallet : disconnectWallet}>
            {!account ? (
              "Connect Wallet"
            ) : (
              <>
                <Wallet />
                {account.slice(0, 4) + "..." + account.slice(38, 42)}
              </>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
