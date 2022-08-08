import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { React, useEffect, useState } from "react";
import Footer from "../components/footer";
import MintEventSlider from "../components/MintEventSlider";
import { useCookies } from "react-cookie";
import { convertToEth } from "../../helpers/numberFormatter";
import { BigNumber } from "bignumber.js";
import evt from "../../events/events";
import "../components-css/App.css";
import Spinner from "../components/Spinner";
import BGImg from "../../assets/images/background.jpg";
import { getMintCollections } from "../../apiServices";

async function lazyImport(addr) {
  let data = await getMintCollections({ address: addr });
  if (!data || data === []) {
    window.location.href = "/";
    return;
  }

  let fileName = data.type;
  console.log("fileName", fileName);
  if (!fileName) {
    throw new Error("file not found");
  }
  const calles = import(`../../helpers/Contract-Calls/${fileName}`);
  return calles;
}

function MultiMintingPage(props) {

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
      NotificationManager.success("mint Succeeded");
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
    } else if (msg.includes("check wallet for confirmation")) {
      setisMintPopupClass("errorIcon");
      setClosePopupDisabled(false);
      NotificationManager.error(msg);
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
    setLoading(true);
    const fetchData = async () => {
      let { fetchInfo } = await contractCalls;
      let getcateg = await fetchInfo(params.id);
      setTotalSupply(getcateg[2].toString());
      setPrice(convertToEth(new BigNumber(getcateg[0].toString())));
      setLoading(false);
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
    <div>
      {loading ? <Spinner /> : ""}
      <section className="collection_banner pdd_8" style={bgImage}></section>
      <section className="collection_info">
        <div className="container">
          <div className="collection_pick">
            <img
              alt=""
              src={collectionDetails?.logoImage}
              className="img-fluid collection_profile"
            />
            {/* <img
              alt=""
              src={"../img/mint/blue_check.png"}
              className="img-fluid check_img"
            /> */}
          </div>
          <h1 className="collection_title text-center">
            {collectionDetails?.name}
          </h1>
          {/* <ul className="collection_social mb-4">
            <li>
              <a href="/">
                <i className="fa fa-facebook fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i className="fa fa-twitter fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i className="fa fa-linkedin fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i className="fa fa-pinterest fa-lg"></i>
              </a>
            </li>
            <li>
              <a href="/">
                <i className="fa fa-rss fa-lg"></i>
              </a>
            </li>
          </ul> */}
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
              <h4>TBA</h4>
              <p>Status</p>
            </li>
          </ul>
          <div className="collection_description text-center">
            <h4 className='hunter-market'>THE POWERHOUSE RIFLE.</h4>
            <h6 className='font_24'>The Model 82 is where the Barrett legacy began.</h6>
            <p>Engineered as the first shoulder fired semi-automatic 50 BMG rifle, the Model 82A1 has been proven in combat in every environment from the snow covered mountains, to the desolate deserts, and everything in between. Its low felt recoil and reliable repower delivers on target with every pull of the trigger. More than just a rifle, the Model 82 is an American icon.</p>
            <p>This is a blind drop, when minting you will receive a random collectable from this series. </p>
            <ul>
              <li>GOLD - Legendary - 100 items</li>
              <li>DIGICAM - Epic - 400 items</li>
              <li>GREY - Ultra-rare - 600 item</li>
              <li>OD Green - Rare - 1100 items</li>
              <li>FDE - Rare - 1100 items</li>
              <li>Black - Classic - 2000 items </li>
            </ul>
            <ul>
              <li>BRAND 	Barrett</li>
              <li>MODEL 	Model 82A1</li>
              <li>LICENSE	Barrett </li>
              <li>SERIES	Firearms series #1</li>
              <li>NAME / alias 	Anti-Material Rifle</li>
              <li>DESIGNED BY 	Ron Barrett</li>
              <li>SPECS 	57" (1448 mm)</li>
              <li>CALIBRE 	50 BMG</li>
              <li>ACTION 	Recoil Operated, Semi-Automatic</li>
              <li>WEIGHT	32.7 lbs. (14.8 kg)</li>
              <li>ORIGIN 	USA</li>
              <li>MAG CAPACITY	10</li>
              <li>RATE OF FIRE 	416</li>
            </ul>
          </div>
          <div className="collection_description text-center">
            <p>{collectionDetails?.description}</p>
            <span className="top_arrow">
              <img alt="" src={"../img/top_arrow.png"} className="img-fluid" />
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
