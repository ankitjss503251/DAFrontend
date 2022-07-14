import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
// import React, { useEffect, useState,lazy } from "react";
import { React, useEffect, useState, lazy } from "react";

import Footer from "../components/footer";
import MintEventSlider from "../components/MintEventSlider";
import { useCookies } from "react-cookie";
import { convertToEth } from "../../helpers/numberFormatter";
import Cookies from "js-cookie";
import { BigNumber } from "bignumber.js";
import evt from "../../events/events";
import "../components-css/App.css";
import { getContractAddress } from "ethers/lib/utils";
import Spinner from "../components/Spinner"
import BGImg from "../../assets/images/background.jpg";

let contractFunctionality = {
  "0xEecd2Ba92f87E332320ce5cFe62afD2B989cb5e9": "rockstarCall",
  "0x40ef57815E2a44518d5c82Fb6c322B613044d6B4": "rockstarCall",
  "0xBf3Bd3E4c3Bf465AA8dBAc067D33c7Ba428c39f2": "rockstarCall",
  "0x49C2652878a7E18B8158A8de4D07DB28094ae2dA": "rockstarCall",
  "0xd33ee4CA8BEdC7877d5930A937EAf6C7c12ea736": "rockstarCall",
  "0x15BC229950E9aa6EA91A4A22ED2f23D2ea7a2475": "rockstarCall",
  "0x246F32c82E6AeD04bf6931a80282bF90d62B4dB4": "rockstarCall",
};

function lazyImport(addr) {
  let fileName = contractFunctionality[addr];
  if (!fileName) {
    throw new Error("file not found");
  }
  const calles = import(`../../helpers/Contract-Calls/${fileName}`);
  return calles;
}

function MultiMintingPage(props) {
  const bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  const params = useParams();

  const contractCalls = lazyImport(params.id);
  const [currentUser, setCurrentUser] = useState();
  const [collectionDetails, setCollectionDetails] = useState();
  const [categories, setcategories] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const { id } = useParams();

  const [createdItemId, setCreatedItemId] = useState();
  const [isPutOnMarketplace, setIsPutOnMarketPlace] = useState(true);
  const [hideClosePopup, sethideClosePopup] = useState(true);
  const [hideRedirectPopup, sethideRedirectPopup] = useState(false);
  const [ClosePopupDisabled, setClosePopupDisabled] = useState(true);
  const [RedirectPopupDisabled, setRedirectPopupDisabled] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [currQty, setCurrQty] = useState(1);
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(false);
  const [isShowPopup, setisShowPopup] = useState(false);
  const [isUploadPopupClass, setisUploadPopupClass] =
    useState("checkiconDefault");
  const [isApprovePopupClass, setisApprovePopupClass] =
    useState("checkiconDefault");
  const [isMintPopupClass, setisMintPopupClass] = useState("checkiconDefault");
  const [isRoyaltyPopupClass, setisRoyaltyPopupClass] =
    useState("checkiconDefault");
  const [isPutOnSalePopupClass, setisPutOnSalePopupClass] =
    useState("checkiconDefault");

  function txnStatus(msg) {
    if (msg.includes("initiate loader")) {
      setisShowPopup(true);
      setisApprovePopupClass("clockloader");
    }
    if (msg.includes("approval completed")) {
      setisApprovePopupClass("checkiconCompleted");
      setisMintPopupClass("clockloader");
    }
    if (msg.includes("mint-initiated")) {
      setisApprovePopupClass("checkiconCompleted");
      setisMintPopupClass("clockloader");
    }
    if (msg.includes("mint-succeed")) {
      setisApprovePopupClass("checkiconCompleted");
      setisMintPopupClass("checkiconCompleted");
      setClosePopupDisabled(false);
      NotificationManager.success("mint Succeed");
    }
  }
  evt.removeAllListeners("txn-status", txnStatus);
  evt.on("txn-status", txnStatus);

  function txnError(msg) {
    if (msg.includes("user-denied-mint")) {
      setisMintPopupClass("errorIcon");
      setClosePopupDisabled(false);
      NotificationManager.error("User denied mint TXN");
      return true;
    } else if (msg.includes("user-denied-approval")) {
      setisApprovePopupClass("errorIcon");
      setClosePopupDisabled(false);
      NotificationManager.error("User denied approval TXN");

      return true;
    } else if (msg.includes("not enough balance")) {
      setisApprovePopupClass("errorIcon");
      setClosePopupDisabled(false);
      NotificationManager.error("not enough token");
      return true;
    } else {
      setisApprovePopupClass("errorIcon");
      setClosePopupDisabled(false);
      NotificationManager.error(msg);
      return true;
    }
    return false;
  }
  evt.removeAllListeners("txn-error", txnError);
  evt.on("txn-error", txnError);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bgImage = {
    backgroundImage: `url(${collectionDetails?.coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    const bodyClass = async () => {
      var body = document.body;
      if (isShowPopup) {
        body.classList.add("overflow_hidden");
      } else {
        body.classList.remove("overflow_hidden");
      }
    };
    bodyClass();
  }, [isShowPopup]);
  useEffect(() => {
  
    const bodyClass = async () => {
      var body = document.body;
      if (loading) {
        body.classList.add("overflow_hidden");
      } else {
        body.classList.remove("overflow_hidden");
      }
    };
    bodyClass();
  }, [loading]);

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      let { fetchInfo } = await contractCalls;
      let getcateg = await fetchInfo(params.id);
      setTotalSupply(getcateg[2].toString());
      setPrice(convertToEth(new BigNumber(getcateg[0].toString())));
      setLoading(false)
    };
    
    setInterval(fetchData, 10000);
    fetchData();

  }, []);
  function closePopup() {
    setisShowPopup(false);
    sethideClosePopup(true);
    sethideRedirectPopup(false);
    setClosePopupDisabled(true);
    setRedirectPopupDisabled(true);
    setisUploadPopupClass("checkiconDefault");
    setisApprovePopupClass("checkiconDefault");
    setisMintPopupClass("checkiconDefault");
    setisRoyaltyPopupClass("checkiconDefault");
    setisPutOnSalePopupClass("checkiconDefault");
  }
  function redirectCreateNFTPopup() {
    if (createdItemId) window.location.href = `/itemDetail/${createdItemId}`;
    else window.location.href = `/profile`;
  }

  return (
    <div style={bgImgStyle}>
       {loading ? <Spinner /> : ""}
      <section className="collection_banner pdd_8" style={bgImage}></section>
      <section className="collection_info">
        <div className="container">
          <div className="collection_pick">
            <img
              alt=""
              src={collectionDetails?.logoImage}
              class="img-fluid collection_profile"
            />
            {/* <img
              alt=""
              src={"../img/mint/blue_check.png"}
              class="img-fluid check_img"
            /> */}
          </div>
          <h1 className="collection_title text-center">
            {collectionDetails?.name}
          </h1>
          <ul class="collection_social mb-4">
            <li>
              <a href="/">
                <i class="fa fa-facebook fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-twitter fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-linkedin fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-pinterest fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i class="fa fa-rss fa-lg"></i>
              </a>
            </li>
          </ul>
          <ul className="collection_status mt-5 mb-5">
            <li>
              <h4>{totalSupply}</h4>
              <p>items</p>
            </li>
            <li>
              <h4>{price}</h4>
              <p>HNTR</p>
            </li>
            <li>
              <h4>Open</h4>
              <p>Status</p>
            </li>
          </ul>
          <div className="collection_description text-center">
            <p>{collectionDetails?.description}</p>
            <span className="top_arrow">
              <img alt="" src={"../img/top_arrow.png"} class="img-fluid" />
            </span>
          </div>
        </div>
      </section>
      <section className="collection_list mb-5 pb-5">
        <div className="container">
          <div className="event_slider">
            <MintEventSlider id={id} price={price} calls={contractCalls} />
          </div>
        </div>
      </section>
      <Footer />
      {isShowPopup ? (
        <div className="popup-bg" id="CreateNftLoader">
          <div className="loader_popup-box">
            <div className="row">
              <h2 className="col-12 d-flex justify-content-center mt-2 mb-3">
                Follow Steps
              </h2>
            </div>

            <div className="row customDisplayPopup">
              <div className="col-3 icontxtDisplayPopup">
                <div className={isApprovePopupClass}></div>
              </div>
              <div className="col-8 icontxtDisplayPopup">
                <h5 className="popupHeading">Approve</h5>
                <span className="popupText">
                  This transaction is conducted only once per collection
                </span>
              </div>
            </div>
            <div className="row customDisplayPopup">
              <div className="col-3 icontxtDisplayPopup">
                <div className={isMintPopupClass}></div>
              </div>
              <div className="col-8 icontxtDisplayPopup">
                <h5 className="popupHeading">Mint</h5>
                <span className="popupText">
                  Send transaction to create your NFT
                </span>
              </div>
            </div>

            <div className="row customDisplayPopup">
              {hideClosePopup ? (
                <button
                  className="closeBtn btn-main"
                  disabled={ClosePopupDisabled}
                  onClick={closePopup}
                >
                  Close
                </button>
              ) : (
                ""
              )}
              {hideRedirectPopup ? (
                <button
                  className="closeBtn btn-main"
                  disabled={RedirectPopupDisabled}
                  onClick={redirectCreateNFTPopup}
                >
                  Close
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default MultiMintingPage;
