import React, { useState, useEffect, useRef, Suspense } from "react";
import Footer from "../components/footer";
import FirearmsCollection from "../components/FirearmsCollection";
import NFTlisting from "../components/NFTlisting";
import NFToffer from "../components/NFToffer";
import NFTBids from "../components/NFTBids";
import { ethers } from "ethers";
import NFThistory from "../components/NFThistory";
import {
  getCollections,
  getNFTs,
  getNFTDetails,
} from "../../helpers/getterFunctions";

import { useParams } from "react-router-dom";
import { convertToEth } from "../../helpers/numberFormatter";
import {
  createOffer,
  putOnMarketplace,
  handleBuyNft,
  createBid,
} from "../../helpers/sendFunctions";
import { useCookies } from "react-cookie";
import { GLTFModel, AmbientLight, DirectionLight } from "react-3d-viewer";

import contracts from "../../config/contracts";
import { GENERAL_DATE } from "../../helpers/constants";
import { NotificationManager } from "react-notifications";
import BGImg from "../../assets/images/background.jpg";
import moment from "moment";
import { Tokens } from "../../helpers/tokensToSymbol";
import Spinner from "../components/Spinner";
import PopupModal from "../components/AccountModal/popupModal";
import Logo from "../../assets/images/logo.svg";
import { slowRefresh } from "../../helpers/NotifyStatus";
import { fetchBidNft, viewNFTDetails } from "../../apiServices";
import { fetchOfferNft } from "../../apiServices";

import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


function loadGLTFModel(scene, glbPath, options) {
  const { receiveShadow, castShadow } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      glbPath,
      (gltf) => {
        const obj = gltf.scene;
        obj.name = "dinosaur";
        obj.position.y = 0;
        obj.position.x = 0;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        scene.add(obj);

        obj.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        resolve(obj);
      },
      undefined,
      function (error) {
        console.log(error);
        reject(error);
      }
    );
  });
}
function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
}

const Show3DImage = () => {
  const refContainer = useRef();
  const [loading, setLoading] = useState(true);
  const [renderer, setRenderer] = useState();

  useEffect(() => {
    const { current: container } = refContainer;
    if (container && !renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const scene = new THREE.Scene();
      const scale = 2;
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.01,
        50000
      );
      const target = new THREE.Vector3(-0.5, 1.2, 0);
      const initialCameraPosition = new THREE.Vector3(
        20 * Math.sin(0.2 * Math.PI),
        10,
        20 * Math.cos(0.2 * Math.PI)
      );
      const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
      scene.add(ambientLight);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.target = target;

      loadGLTFModel(scene, "https://hunter.techdigital.com.au/Parrot.glb", {
        receiveShadow: false,
        castShadow: false
      }).then(() => {
        animate();
        setLoading(false);
      });

      let req = null;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);
        frame = frame <= 100 ? frame + 1 : frame;

        if (frame <= 100) {
          const p = initialCameraPosition;
          const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;

          camera.position.y = 10;
          camera.position.x =
            p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
          camera.position.z =
            p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
          camera.lookAt(target);
        } else {
          controls.update();
        }

        renderer.render(scene, camera);
      };

      return () => {
        cancelAnimationFrame(req);
        renderer.dispose();
      };
    }
  }, []);

  return (
    <div
      style={{ height: "350px", width: "350px", position: "relative" }}
      ref={refContainer}
    >
      {loading && (
        <span style={{ position: "absolute", left: "50%", top: "50%" }}>
          Loading...
        </span>
      )}
    </div>
  );
};


var textColor = {
  textColor: "#EF981D",
};

function NFTDetails() {
  var bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  const { id } = useParams();

  const [NFTDetails, setNFTDetails] = useState([]);
  const [allNFTs, setAllNFTs] = useState([]);
  const [collection, setCollection] = useState([]);
  const [marketplaceSaleType, setmarketplaceSaleType] = useState(0);
  const [itemprice, setItemprice] = useState(0);
  const [item_qt, setItem_qt] = useState(1);
  const [item_bid, setItem_bid] = useState(0);
  const [selectedToken, setSelectedToken] = useState("BUSD");
  const [selectedTokenFS, setSelectedTokenFS] = useState("BNB");
  const [datetime, setDatetime] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [cookies] = useCookies([]);
  const [owned, setOwned] = useState("none");
  const [orders, setOrders] = useState("none");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState();
  const [offerQuantity, setOfferQuantity] = useState(1);
  const [isBuyNowModal, setIsBuyNowModal] = useState(false);
  const [isPlaceBidModal, setIsPlaceBidModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState("");
  const [firstOrderNFT, setFirstOrderNFT] = useState([]);
  const [haveBid, setHaveBid] = useState("none");
  const [haveOffer, setHaveOffer] = useState("none");
  const [ownedBy, setOwnedBy] = useState("");
  const [bidStatus, setBidStatus] = useState("");

  useEffect(() => {
    async function setUser() {
      if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    }
    setUser();
  }, [cookies.selected_account]);

  useEffect(() => {
    async function windowScroll() {
      window.scrollTo(0, 0);
    }
    windowScroll();
  }, []);

  

  useEffect(() => {
    const fetch = async () => {
      try {
        const reqData = {
          nftID: id,
        };
        const res = await getNFTDetails(reqData);
        if (res.length === 0) {
          window.location.href = "/marketplace";
          return;
        }
        setNFTDetails(res[0]);
        setOrders(res[0]?.OrderData);
        if (res[0]?.OrderData.length <= 0) {
          setOrders([]);
        }
        setOwnedBy(res[0]?.ownedBy[res[0]?.ownedBy?.length - 1]?.address);
        const c = await getCollections({ collectionID: res[0].collection });
        setCollection(c[0]);

        const reqData1 = {
          page: 1,
          limit: 12,
          collectionID: res[0].collection,
        };

        const nfts = await getNFTs(reqData1);

        setAllNFTs(nfts);
        if (
          currentUser &&
          res[0].ownedBy &&
          res[0]?.ownedBy[0]?.address?.toLowerCase()
        ) {
          for (let i = 0; i < res[0]?.ownedBy?.length; i++) {
            if (
              res[0]?.ownedBy[i]?.address?.toLowerCase() ===
              currentUser?.toLowerCase()
            ) {
              setOwned(true);
              break;
            } else setOwned(false);
          }
        }

        if (id) {
          const _nft = await getNFTDetails({
            nftID: id,
          });
          setOrders(_nft[0]?.OrderData);
          if (_nft[0]?.OrderData.length <= 0) {
            setOrders([]);
          }
          setFirstOrderNFT(_nft[0]);
        }
      } catch (e) {
        console.log("Error in fetching nft Details", e);
      }
    };
    fetch();
  }, [id, currentUser]);

  useEffect(() => {
    const fetch = async () => {
      let searchParams = {
        nftID: NFTDetails.id,
        buyerID: localStorage.getItem("userId"),
        bidStatus: "All",
        orderID: "All",
      };

      let _data = await fetchBidNft(searchParams);
      if (_data && _data.data.length > 0) {
        const b = _data.data[0];
        setHaveBid(true);

        setPrice(convertToEth(b?.bidPrice?.$numberDecimal));
        setBidStatus(b?.bidStatus);
      } else {
        setHaveBid(false);
      }
    };
    fetch();
  }, [NFTDetails]);

  useEffect(() => {
    const fetch = async () => {
      let searchParams = {
        nftID: NFTDetails.id,
        buyerID: localStorage.getItem("userId"),
        bidStatus: "All",
        orderID: "All",
      };

      let _data = await fetchOfferNft(searchParams);

      if (_data && _data.data.length > 0) {
        const b = _data.data[0];
        setHaveOffer(true);

        setOfferPrice(convertToEth(b?.bidPrice?.$numberDecimal));
        setDatetime(moment(b?.bidDeadline * 1000).toISOString());
      } else {
        setHaveOffer(false);
      }
    };
    fetch();
  }, [NFTDetails]);

  const PutMarketplace = async () => {
    setLoading(true);
    

    if (marketplaceSaleType === 0) {
      if (itemprice === undefined || itemprice === "" || itemprice === 0) {
        NotificationManager.error("Please Enter a price", "", 800);
        setLoading(false);
        return;
      }
    } else {
      if (item_bid === undefined || item_bid === "" || item_bid === 0) {
        NotificationManager.error("Please Enter Minimum Bid", "", 800);
        setLoading(false);
        return;
      }
    }
    let orderData = {
      nftId: NFTDetails.id,
      collection: NFTDetails.collectionAddress,
      price: itemprice,
      quantity: item_qt,
      saleType: marketplaceSaleType === 1 || marketplaceSaleType === 2 ? 1 : 0,
      salt: Math.round(Math.random() * 10000000),
      endTime: datetime ? datetime : GENERAL_DATE,
      chosenType: marketplaceSaleType,
      minimumBid: item_bid !== "" ? item_bid : 0,
      // auctionEndDate: endTime ? endTime : new Date(GENERAL_DATE),
      tokenAddress:
        marketplaceSaleType === 0
          ? contracts[selectedTokenFS]
          : contracts[selectedToken],
      tokenId: NFTDetails.tokenId,
      erc721: NFTDetails.type === 1,
    };
    let res = await putOnMarketplace(currentUser, orderData);
    if (res === false) {
      setLoading(false);
      return;
    } else {
      NotificationManager.success("Imported successfully");
      setLoading(false);
      return;
    }
  };

  const PlaceOffer = async () => {
    setLoading(true);

    if (currentUser === undefined || currentUser === "") {
      NotificationManager.error("Please Connect Metamask");
      setLoading(false);
      return;
    }

    if (offerPrice == "" || offerPrice === undefined) {
      NotificationManager.error("Enter Offer Price");
      setLoading(false);
      return;
    }

    if (offerQuantity === "" ||(offerQuantity === undefined && NFTDetails.type !== 1)) {
      NotificationManager.error("Enter Offer Quantity");
      setLoading(false);
      return;
    }
    if (datetime === "") {
      NotificationManager.error("Enter Offer EndTime");
      setLoading(false);
      return;
    }

    let deadline = moment(datetime).unix();
    // let tokenAddress =
    //   marketplaceSaleType === 0
    //     ? contracts[selectedTokenFS]
    //     : contracts[selectedToken];
    await createOffer(
      NFTDetails?.tokenId,
      collection?.contractAddress,
      NFTDetails?.ownedBy[0],
      currentUser,
      NFTDetails?.type,
      offerQuantity,
      ethers.utils.parseEther(offerPrice),
      deadline,
      NFTDetails.id,
      contracts.BUSD
    );
    setLoading(false);

    // slowRefresh(1000);

    //await putOnMarketplace(currentUser, orderData);
  };

  function Model(props) {
    const { scene } = useGLTF(props.image);
    return <primitive object={scene} />;
  }

  // Popup

  const handleMpShow = () => {
    document.getElementById("tab_opt_1").classList.remove("put_hide");
    document.getElementById("tab_opt_1").classList.add("put_show");
    document.getElementById("tab_opt_2").classList.remove("put_hide");
    document.getElementById("tab_opt_2").classList.add("put_show");
    document.getElementById("tab_opt_3").classList.remove("put_show");
    document.getElementById("tab_opt_3").classList.add("put_hide");
    document.getElementById("tab_opt_4").classList.remove("put_show");
    document.getElementById("tab_opt_4").classList.add("put_hide");
    document.getElementById("tab_opt_5").classList.remove("put_show");
    document.getElementById("tab_opt_5").classList.add("put_hide");
    document.getElementById("btn1").classList.add("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.remove("active");
    setmarketplaceSaleType(0);
  };

  const handleMpShow1 = () => {
    document.getElementById("tab_opt_1").classList.remove("put_show");
    document.getElementById("tab_opt_1").classList.add("put_hide");
    document.getElementById("tab_opt_2").classList.remove("put_hide");
    document.getElementById("tab_opt_2").classList.add("put_show");
    document.getElementById("tab_opt_3").classList.remove("put_hide");
    document.getElementById("tab_opt_3").classList.add("put_show");
    document.getElementById("tab_opt_4").classList.remove("put_hide");
    document.getElementById("tab_opt_4").classList.add("put_show");
    // document.getElementById("tab_opt_5").classList.remove("put_hide");
    // document.getElementById("tab_opt_5").classList.add("put_show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.add("active");
    document.getElementById("btn3").classList.remove("active");
    setmarketplaceSaleType(1);
  };

  const handleMpShow2 = () => {
    document.getElementById("tab_opt_1").classList.remove("put_show");
    document.getElementById("tab_opt_1").classList.add("put_hide");
    document.getElementById("tab_opt_2").classList.remove("put_hide");
    document.getElementById("tab_opt_2").classList.add("put_show");
    document.getElementById("tab_opt_3").classList.remove("put_hide");
    document.getElementById("tab_opt_3").classList.add("put_show");
    document.getElementById("tab_opt_4").classList.remove("put_hide");
    document.getElementById("tab_opt_4").classList.add("put_show");
    document.getElementById("tab_opt_5").classList.remove("put_show");
    document.getElementById("tab_opt_5").classList.add("put_hide");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.add("active");
    setmarketplaceSaleType(2);
  };

  function handleChange(ev) {
    if (!ev.target["validity"].valid) return;

    const dt = ev.target["value"] + ":00Z";

    const ct = moment().toISOString();

    if (dt < ct) {
      NotificationManager.error(
        "Start date should not be of past date",
        "",
        800
      );
      return;
    }
    setDatetime(dt);
  }

  useEffect(() => {
    async function addClassList() {
      var body = document.body;
      if (loading || isPlaceBidModal || isBuyNowModal) {
        body.classList.add("overflow_hidden");
      } else {
        body.classList.remove("overflow_hidden");
      }
    }
    addClassList();
  }, [loading, isPlaceBidModal, isBuyNowModal]);


  // Place Bid Checkout Modal

  const placeBidModal = (
    <PopupModal
      content={
        <div className="popup-content1">
          <h3 className="modal_heading ">Complete Checkout</h3>
          <div className="bid_user_details my-4">
            <img src={Logo} alt="" />

            <div className="bid_user_address">
              <div>
                <span className="adr">
                  {currentUser?.slice(0, 8) +
                    "..." +
                    currentUser?.slice(34, 42)}
                </span>
                <span className="badge badge-success">Connected</span>
              </div>
              <span className="pgn">Polygon</span>
            </div>
          </div>
          <h6 className="enter_quantity_heading required">
            Please Enter the Bid Quantity
          </h6>
          <input
            className="form-control checkout_input"
            type="text"
            min="1"
            step="1"
            placeholder="Quantity e.g. 1,2,3..."
            disabled={firstOrderNFT.type === 1 ? true : false}
            value={qty}
            onKeyPress={(e) => {
              if (!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if (Number(e.target.value) > Number(100)) {
                NotificationManager.error(
                  "Quantity should be less than seller's order",
                  "",
                  800
                );
                return;
              }
              setQty(e.target.value);
            }}
          ></input>
          <h6 className="enter_price_heading required">
            Please Enter the Bid Price
          </h6>

          <input
            className="form-control checkout_input"
            type="text"
            min="1"
            placeholder="Price e.g. 0.001,1..."
            value={price}
            onKeyPress={(e) => {
              if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              const re = /[+-]?[0-9]+\.?[0-9]*/;
              let val = e.target.value;

              if (e.target.value === "" || re.test(e.target.value)) {
                const numStr = String(val);
                if (numStr.includes(".")) {
                  if (numStr.split(".")[1].length > 8) {
                  } else {
                    if (val.split(".").length > 2) {
                      val = val.replace(/\.+$/, "");
                    }
                    if (val.length === 1 && val !== "0.") {
                      val = Number(val);
                    }
                  }
                } else {
                  if (val.split(".").length > 2) {
                    val = val.replace(/\.+$/, "");
                  }
                  if (val.length === 1 && val !== "0.") {
                    val = Number(val);
                  }
                }
                setPrice(val);
              }
            }}
          ></input>

          <button
            className="btn-main mt-2 btn-placeABid"
            onClick={async () => {
              setIsPlaceBidModal(false);
              setLoading(true);
              if (
                Number(price) <
                Number(convertToEth(orders[0].price?.$numberDecimal))
              ) {
                NotificationManager.error(
                  "Bid Price must be greater than minimum bid",
                  "",
                  800
                );
                setIsPlaceBidModal(true);
                setLoading(false);
                return;
              }
              try {
                await createBid(
                  orders[0].nftID,
                  orders[0]._id,
                  orders[0].sellerID?._id,
                  currentUser,
                  firstOrderNFT?.type,
                  orders[0].total_quantity,
                  ethers.utils.parseEther(price.toString()),
                  false
                  // new Date(bidDeadline).valueOf() / 1000
                );
                NotificationManager.success("Bid Placed Successfully", "", 800);
                setLoading(false);
                slowRefresh(1000);
              } catch (e) {
                NotificationManager.error("Something went wrong", "", 800);
              }
            }}
          >
            {haveBid ? "Update Bid" : "Place Bid"}
          </button>
        </div>
      }
      handleClose={() => {
        setIsPlaceBidModal(!isPlaceBidModal);
        setQty(1);
        if (!haveBid) setPrice("");
      }}
    />
  );

  // Buy Now Checkout Modal

  const buyNowModal = (
    <PopupModal
      content={
        <div className="popup-content1">
          <h3 className="modal_heading ">Complete Checkout</h3>
          <div className="bid_user_details my-4">
            <img src={Logo} alt="" />
            <div className="bid_user_address">
              <div>
                <span className="adr">
                  {currentUser?.slice(0, 8) +
                    "..." +
                    currentUser?.slice(34, 42)}
                </span>
                <span className="badge badge-success">Connected</span>
              </div>
              <span className="pgn">Polygon</span>
            </div>
          </div>
          <h6 className="enter_quantity_heading required">
            {firstOrderNFT?.type === 1
              ? "Quantity"
              : "Please Enter the Quantity"}
          </h6>
          <input
            className="form-control checkout_input"
            type="text"
            min="1"
            step="1"
            placeholder="Quantity e.g. 1,2,3..."
            disabled={firstOrderNFT?.type === 1 ? true : false}
            value={qty}
            onKeyPress={(e) => {
              if (!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if (Number(e.target.value) > Number(orders[0].total_quantity)) {
                NotificationManager.error(
                  "Quantity should be less than seller's order",
                  "",
                  800
                );
                return;
              }

              setQty(e.target.value);
            }}
          ></input>
          <h6 className="enter_price_heading required">Price</h6>
          <input
            className="form-control checkout_input"
            type="text"
            min="1"
            placeholder="Price e.g. 0.001,1..."
            disabled={true}
            value={Number(
              convertToEth(orders[0]?.price?.$numberDecimal)
            ).toFixed(4)}
          ></input>

          <button
            className="btn-main mt-2 btn-placeABid"
            onClick={async () => {
              setIsBuyNowModal(false);
              setLoading(true);
              let res = await handleBuyNft(
                orders[0]._id,
                firstOrderNFT.type === 1,
                currentUser,
                cookies.balance,
                orders[0].total_quantity,
                false,
                firstOrderNFT?.collectionAddress?.toLowerCase()
              );
              if (res === false) {
                setLoading(false);
                return;
              }
              setLoading(false);
              // slowRefresh(1000);
            }}
          >
            {"Buy Now"}
          </button>
        </div>
      }
      handleClose={() => {
        setIsBuyNowModal(!isBuyNowModal);
        setQty(1);
        setPrice("");
      }}
    />
  );

  return (
    <div>
      {loading ? <Spinner /> : ""}
      {isPlaceBidModal ? placeBidModal : ""}
      {isBuyNowModal ? buyNowModal : ""}
      <section style={bgImgStyle} className="pdd_8">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-6 mb-xl-5 mb-lg-5 mb-5">
              {NFTDetails && NFTDetails.fileType == "Image" ? (
                <img
                  src={NFTDetails?.image}
                  className="img-fluid nftimg"
                  alt=""
                  onError={(e) => {
                    e.target.src = "../img/collections/list4.png";
                  }}
                />
              ) : (
                ""
              )}
              {NFTDetails && NFTDetails.fileType == "Video" ? (
                <video className="img-fluid nftimg" controls>
                  <source src={NFTDetails?.image} type="video/mp4" />
                </video>
              ) : (
                ""
              )}

              {NFTDetails && NFTDetails.fileType == "3D" ? (
                <Canvas camera={{ position: [10, 100, 100], fov: 1 }}>
                  <pointLight position={[10, 10, 10]} intensity={1.3} />
                  <Suspense fallback={null}>
                    <Model image={NFTDetails.image} />
                  </Suspense>
                  <OrbitControls />
                </Canvas>
              ) : (
                ""
              )}
            </div>
            <div className="col-lg-6 nft_details">
              <p className="mb-0">
                {collection?.name} Collection{" "}
                <img src={"../img/check.png"} className="img-fluid" alt="" />
              </p>
              <h1 className="mb-3">{NFTDetails?.name}</h1>
              <div className="owner_by mb-4">
                <p>
                  Owned by{" "}
                  <span style={textColor}>
                    {ownedBy.slice(0, 8) + "..." + ownedBy.slice(34, 42)}
                  </span>
                </p>
                <span className="add_wishlist">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.6328 6.64689C21.3187 5.91947 20.8657 5.2603 20.2992 4.70626C19.7323 4.15058 19.064 3.70898 18.3305 3.40548C17.5699 3.08953 16.7541 2.92781 15.9305 2.9297C14.775 2.9297 13.6477 3.24611 12.668 3.84377C12.4336 3.98673 12.2109 4.14376 12 4.31486C11.7891 4.14376 11.5664 3.98673 11.332 3.84377C10.3523 3.24611 9.225 2.9297 8.06953 2.9297C7.2375 2.9297 6.43125 3.08908 5.66953 3.40548C4.93359 3.71017 4.27031 4.14845 3.70078 4.70626C3.13359 5.25967 2.6805 5.919 2.36719 6.64689C2.04141 7.40392 1.875 8.20782 1.875 9.03516C1.875 9.81563 2.03438 10.6289 2.35078 11.4563C2.61563 12.1477 2.99531 12.8648 3.48047 13.5891C4.24922 14.7352 5.30625 15.9305 6.61875 17.1422C8.79375 19.1508 10.9477 20.5383 11.0391 20.5945L11.5945 20.9508C11.8406 21.1078 12.157 21.1078 12.4031 20.9508L12.9586 20.5945C13.05 20.5359 15.2016 19.1508 17.3789 17.1422C18.6914 15.9305 19.7484 14.7352 20.5172 13.5891C21.0023 12.8648 21.3844 12.1477 21.6469 11.4563C21.9633 10.6289 22.1227 9.81563 22.1227 9.03516C22.125 8.20782 21.9586 7.40392 21.6328 6.64689Z"
                      fill="#9E9E9E"
                    />
                  </svg>{" "}
                  {NFTDetails?.like} favourites
                </span>
              </div>
              {NFTDetails?.attributes?.length > 0 ? (
                <ul
                  className="nav nav-pills mb-4 w-100"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item w-100" role="presentation">
                    <button
                      className="nav-link active details-btn "
                      id="pills-home-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-home"
                      type="button"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                    >
                      Details
                    </button>
                  </li>
                </ul>
              ) : (
                ""
              )}
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row">
                    {NFTDetails
                      ? NFTDetails?.attributes?.map((attr, key) => {
                          const rarity = parseInt(attr?.rarity);
                          return (
                            <div className="col-md-6 mb-4" key={key}>
                              <div className="tab_label">
                                <div className="d-flex align-items-start flex-column">
                                  <p>{attr.trait_type}</p>
                                  <span className="big_text">{attr.value}</span>
                                </div>
                                {rarity ? (
                                  <p>
                                    {rarity}% <span>have this traits</span>
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                              {rarity ? (
                                <div className="progress mt-2">
                                  <div
                                    className={`progress-bar w-${rarity}`}
                                    role="progressbar"
                                    aria-valuenow={rarity}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              ) : (
                                ""
                              )}
                              {/* <div className='progress'>
                          <div
                            className='progress-bar w-75'
                            role='progressbar'
                            aria-valuenow='75'
                            aria-valuemin='0'
                            aria-valuemax='100'></div>
                        </div> */}
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </div>
              <div className="price_box">
                {orders?.length > 0 && orders !== "none" ? (
                  <>
                    <h4>Price</h4>
                    <div className="price_div">
                      <img
                        src={Tokens[orders[0].paymentToken]?.icon}
                        className="img-fluid hunter_fav"
                        alt=""
                      />
                      {Number(convertToEth(orders[0].price?.$numberDecimal))
                        .toFixed(6)
                        .slice(0, -2)}{" "}
                      {Tokens[orders[0].paymentToken]?.symbolName}
                    </div>
                  </>
                ) : (
                  ""
                )}
                {orders.length <= 0 && orders !== "none" && owned !== "none" ? (
                  owned ? (
                    <button
                      type="button"
                      className="title_color buy_now"
                      data-bs-toggle="modal"
                      data-bs-target="#detailPop"
                    >
                      Put On Marketplace
                    </button>
                  ) : (
                    ""
                  )
                ) : !owned &&
                  orders.length > 0 &&
                  owned !== "none" &&
                  haveBid !== "none" &&
                  haveOffer !== "none" ? (
                  orders[0].salesType === 0 ? (
                    <button
                      type="button"
                      className="title_color buy_now"
                      onClick={() => {
                        setIsBuyNowModal(true);
                      }}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={
                        moment(new Date(orders[0].deadline * 1000)).subtract({
                          hours: 5,
                          minutes: 30,
                        })._d < new Date()
                      }
                      className="title_color buy_now"
                      onClick={() => {
                        setIsPlaceBidModal(true);
                      }}
                    >
                      {haveBid && haveBid !== "none"
                        ? "Update Bid"
                        : "Place Bid"}
                    </button>
                  )
                ) : (
                  ""
                )}
                {!owned && owned !== "none" && haveOffer !== "none" ? (
                  <button
                    type="button"
                    className="border_btn title_color"
                    data-bs-toggle="modal"
                    data-bs-target="#makeOfferModal"
                    onClick={() => setModal("active")}
                  >
                    {haveOffer ? "Update Offer" : "Make Offers"}
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Description</h3>
              <p className="textdes">{NFTDetails?.desc} </p>
            </div>
            <div className="col-lg-6 mb-5 text-break">
              <h3 className="title_36 mb-4 ">
                About {collection?.name} Collection
              </h3>
              <div className="row">
                <div className="col-md-4 nftDetails_img_con">
                  <img src={collection?.logoImg} alt="" className="img-fluid" />
                </div>
                <div className="col-md-8">
                  <p className="textdes">{collection?.desc} </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Asset Details</h3>
              <ul className="nft_detaillist">
                <li>
                  <span className="asset_title">Size</span>
                  <span className="asset_detail">
                    {NFTDetails?.assetsInfo?.size} KB
                  </span>
                </li>
                <li>
                  <span className="asset_title">Dimension</span>
                  <span className="asset_detail">
                    {NFTDetails?.assetsInfo?.dimension} px
                  </span>
                </li>
                <li>
                  <span className="asset_title">Format</span>
                  <span className="asset_detail">
                    {NFTDetails?.assetsInfo?.type}
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 mb-5">
              <h3 className="title_36 mb-4">Blockchain Details</h3>
              <ul className="nft_detaillist">
                <li>
                  <span className="asset_title">Contact Address</span>
                  <span className="asset_detail">
                    {collection?.contractAddress?.slice(0, 4) +
                      "..." +
                      collection?.contractAddress?.slice(38, 42)}
                  </span>
                </li>
                <li>
                  <span className="asset_title">Token ID</span>
                  <span className="asset_detail">{NFTDetails?.tokenId}</span>
                </li>
                <li>
                  <span className="asset_title">Blockchain</span>
                  <span className="asset_detail">Binance Smart Chain</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Properties</h3>
              <ul className="nft_detaillist">
                <li>
                  <span className="asset_title">SERIAL</span>
                  <span className="asset_detail">{NFTDetails?.tokenId}</span>
                </li>
                <li>
                  <span className="asset_title">TYPE</span>
                  <span className="asset_detail">
                    {NFTDetails?.catergoryInfo?.name}
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 mb-5">
              <h3 className="title_36 mb-4">Levels</h3>
              <ul className="nft_detailnumber">
                <li>
                  <span>1</span>Generation
                </li>
                <li>
                  <span>3</span>PPM
                </li>
              </ul>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">
                Trading History for Meta Marines
              </h3>
              <img
                src={"../img/nftdetails/graf.png"}
                alt=""
                className="img-fluid box_shadow"
              />
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Listings</h3>
              <div className="table-responsive">
                <NFTlisting id={NFTDetails.id} NftDetails={NFTDetails} />
              </div>
            </div>

            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Bids</h3>
              <div className="table-responsive">
                <NFTBids id={NFTDetails.id} NftDetails={NFTDetails} />
              </div>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Offers</h3>
              <div className="table-responsive">
                <NFToffer
                  id={NFTDetails.id}
                  NftDetails={NFTDetails}
                  collectionAddress={collection?.contractAddress}
                />
              </div>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">History</h3>
              <div className="table-responsive">
                <NFThistory />
              </div>
            </div>
            {allNFTs.length > 1 ? (
              <>
                <div className="col-md-12 ">
                  <h3 className="title_36 mb-4">
                    More from {collection?.name} Collection
                  </h3>
                  <FirearmsCollection
                    nfts={allNFTs}
                    currNFTID={NFTDetails?.id}
                    collectionName={collection?.name}
                  />
                </div>
                {allNFTs.length > 4 ? (
                  <div className="col-md-12 text-center mt-5">
                    <a
                      className="view_all_bdr"
                      href={`/collection/${collection?._id}`}
                    >
                      View All
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      {/* <!-- The Modal --> */}
      <div className={`modal marketplace putOnMarketplace`} id="detailPop">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header p-4">
              <h4 className="text-light title_20 mb-0">Put on Marketplace</h4>
              <button
                type="button"
                className="btn-close text-light"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <h3 className="text-light text_16">Select method</h3>

              <ul
                className="d-flex mb-4 justify-content-around g-3"
                id="pills-tab"
                role="tablist"
              >
                <li className="list-unstyled">
                  <button
                    id="btn1"
                    className="navbtn active"
                    type="button"
                    onClick={handleMpShow}
                  >
                    <i className="fa fa-tag"></i>
                    <span className="title_20 d-block">Fixed price</span>
                  </button>
                </li>
                <li className="list-unstyled">
                  <button
                    id="btn2"
                    className="navbtn"
                    type="button"
                    onClick={handleMpShow1}
                  >
                    <i className="fa fa-hourglass-1"></i>
                    <span className="title_20 d-block">Timed auction</span>
                  </button>
                </li>
                <li className="list-unstyled">
                  <button
                    id="btn3"
                    className="navbtn"
                    type="button"
                    onClick={handleMpShow2}
                  >
                    <i className="fa fa-users"></i>
                    <span className="title_20 d-block">Open for bids</span>
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {marketplaceSaleType === 0 ? (
                  <div className="mb-3" id="tab_opt_1">
                    <label htmlFor="item_price" className="form-label">
                      Price
                    </label>
                    <input
                      type="text"
                      name="item_price"
                      id="item_price"
                      min="0"
                      max="18"
                      className="form-control input_design"
                      placeholder="Please Enter Price (MATIC)"
                      value={itemprice}
                      onKeyPress={(e) => {
                        if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        const re = /[+-]?[0-9]+\.?[0-9]*/;
                        let val = e.target.value;

                        if (e.target.value === "" || re.test(e.target.value)) {
                          const numStr = String(val);
                          if (numStr.includes(".")) {
                            if (numStr.split(".")[1].length > 8) {
                            } else {
                              if (val.split(".").length > 2) {
                                val = val.replace(/\.+$/, "");
                              }
                              if (val.length === 1 && val !== "0.") {
                                val = Number(val);
                              }
                            }
                          } else {
                            if (val.split(".").length > 2) {
                              val = val.replace(/\.+$/, "");
                            }
                            if (val.length === 1 && val !== "0.") {
                              val = Number(val);
                            }
                          }
                          setItemprice(val);
                        }
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="mb-3" id="tab_opt_2">
                  <label htmlFor="item_qt" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="item_qt"
                    id="item_qt"
                    min="1"
                    disabled={NFTDetails.type === 1 ? "disabled" : ""}
                    className="form-control input_design"
                    placeholder="Please Enter Quantity"
                    value={item_qt}
                    onChange={(event) => {
                      if (
                        NFTDetails.type !== 1 &&
                        event.target.value > NFTDetails?.totalQuantity
                      ) {
                        NotificationManager.error(
                          "Quantity must be less than or equal to total quantity.",
                          "",
                          800
                        );
                        return;
                      }
                      setItem_qt(event.target.value);
                    }}
                  />
                </div>
                <div id="tab_opt_3" className="mb-3 put_hide">
                  <label htmlFor="item_bid" className="form-label">
                    Minimum bid
                  </label>
                  <input
                    type="text"
                    name="item_bid"
                    id="item_bid"
                    min="0"
                    max="18"
                    className="form-control input_design"
                    placeholder="Enter Minimum Bid"
                    value={item_bid}
                    onKeyPress={(e) => {
                      if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                      const re = /[+-]?[0-9]+\.?[0-9]*/;
                      let val = e.target.value;

                      if (e.target.value === "" || re.test(e.target.value)) {
                        const numStr = String(val);
                        if (numStr.includes(".")) {
                          if (numStr.split(".")[1].length > 8) {
                          } else {
                            if (val.split(".").length > 2) {
                              val = val.replace(/\.+$/, "");
                            }
                            if (val.length === 1 && val !== "0.") {
                              val = Number(val);
                            }
                          }
                        } else {
                          if (val.split(".").length > 2) {
                            val = val.replace(/\.+$/, "");
                          }
                          if (val.length === 1 && val !== "0.") {
                            val = Number(val);
                          }
                        }
                        setItem_bid(val);
                      }
                    }}
                  />
                </div>

                <div id="tab_opt_4" className="mb-3">
                  <label htmlFor="Payment" className="form-label">
                    Payment Token
                  </label>

                  {marketplaceSaleType === 0 ? (
                    <>
                      <select
                        className="form-select input_design select_bg"
                        name="BNB"
                        value={selectedTokenFS}
                        onChange={(event) => {
                          event.preventDefault();
                          event.persist();
                          setSelectedTokenFS(event.target.value);
                        }}
                      >
                        {" "}
                        <option value={"BNB"} selected>
                          BNB
                        </option>
                        <option value={"HNTR"}>HNTR</option>
                        <option value={"BUSD"}>BUSD</option>
                      </select>
                    </>
                  ) : marketplaceSaleType === 1 ? (
                    <>
                      <select
                        className="form-select input_design select_bg"
                        name="BUSD"
                        value={selectedToken}
                        onChange={(event) =>
                          setSelectedToken(event.target.value)
                        }
                      >
                        {" "}
                        <option value={"BUSD"} selected>
                          BUSD
                        </option>
                      </select>
                    </>
                  ) : (
                    <>
                      <select
                        className="form-select input_design select_bg"
                        name="BUSD"
                        value={selectedToken}
                        onChange={(event) =>
                          setSelectedToken(event.target.value)
                        }
                      >
                        <option value={"BUSD"} selected>
                          BUSD
                        </option>
                      </select>
                    </>
                  )}
                </div>
                {marketplaceSaleType === 1 ? (
                  <div id="tab_opt_5" className="mb-3">
                    <label for="item_ex_date" className="form-label">
                      Expiration date
                    </label>
                    <input
                      type="datetime-local"
                      value={datetime.toString().substring(0, 16)}
                      onChange={handleChange}
                      className="input_design"
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="mt-5 mb-3 text-center">
                  <button
                    type="button"
                    className="square_yello"
                    href="/mintcollectionlive"
                    onClick={PutMarketplace}
                  >
                    Put On Marketplace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Bid/Offer Modal*/}

      <div className="modal marketplace" id="makeOfferModal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header p-4">
              <h4 className="text-light title_20 mb-0">Offer</h4>
              <button
                type="button"
                className="btn-close text-light"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <div className="tab-content">
                <div className="mb-3" id="tab_opt_1">
                  <label htmlFor="item_price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    name="item_price"
                    id="item_price"
                    min="0"
                    max="18"
                    className="form-control input_design"
                    placeholder="Please Enter Price"
                    value={offerPrice}
                    onKeyPress={(e) => {
                      if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
                    }}
                    onChange={(e) => {
                      const re = /[+-]?[0-9]+\.?[0-9]*/;
                      let val = e.target.value;

                      if (e.target.value === "" || re.test(e.target.value)) {
                        const numStr = String(val);
                        if (numStr.includes(".")) {
                          if (numStr.split(".")[1].length > 8) {
                          } else {
                            if (val.split(".").length > 2) {
                              val = val.replace(/\.+$/, "");
                            }
                            if (val.length === 1 && val !== "0.") {
                              val = Number(val);
                            }
                          }
                        } else {
                          if (val.split(".").length > 2) {
                            val = val.replace(/\.+$/, "");
                          }
                          if (val.length === 1 && val !== "0.") {
                            val = Number(val);
                          }
                        }
                        setOfferPrice(val);
                      }
                    }}
                  />
                </div>
                <div className="mb-3" id="tab_opt_2">
                  <label htmlFor="item_qt" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="item_qt"
                    id="item_qt"
                    min="1"
                    disabled={NFTDetails.type === 1 ? true : false}
                    className="form-control input_design"
                    placeholder="Please Enter Quantity"
                    value={offerQuantity}
                    onChange={(event) => {
                      if (NFTDetails.type === 1 && event.target.value > 1) {
                        setOfferQuantity(1);
                        NotificationManager.error(
                          "Quantity must be 1.",
                          "",
                          800
                        );
                      }
                      if (
                        NFTDetails.type !== 1 &&
                        event.target.value > NFTDetails?.totalQuantity
                      ) {
                        NotificationManager.error(
                          "Quantity must be less than or equal to total quantity.",
                          "",
                          800
                        );
                        return;
                      }
                    }}
                  />
                </div>
                <div id="tab_opt_4" className="mb-3">
                  <label htmlFor="Payment" className="form-label">
                    Payment Token
                  </label>

                  {marketplaceSaleType === 0 ? (
                    <>
                      <select
                        className="form-select input_design select_bg"
                        name="BNB"
                        value={selectedTokenFS}
                        onChange={(event) => {
                          event.preventDefault();
                          event.persist();
                          setSelectedTokenFS(event.target.value);
                        }}
                      >
                        {" "}
                        <option value={"BNB"} selected>
                          BNB
                        </option> 
                        {/* <option value={"HNTR"}>HNTR</option> */}
                        <option value={"BUSD"}>BUSD</option>
                      </select>
                    </>
                  ) : marketplaceSaleType === 1 ? (
                    <>
                      <select
                        className="form-select input_design select_bg"
                        name="BUSD"
                        value={selectedToken}
                        onChange={(event) =>
                          setSelectedToken(event.target.value)
                        }
                      >
                        {" "}
                        <option value={"BUSD"} selected>
                          BUSD
                        </option>
                      </select>
                    </>
                  ) : (
                    <>
                      <select
                        className="form-select input_design select_bg"
                        name="BUSD"
                        value={selectedToken}
                        onChange={(event) =>
                          setSelectedToken(event.target.value)
                        }
                      >
                        <option value={"BUSD"} selected>
                          BUSD
                        </option>
                      </select>
                    </>
                  )}
                </div>

                <div id="tab_opt_5" className="mb-3 ">
                  <label htmlFor="item_ex_date" className="form-label">
                    Expiration date
                  </label>
                  {/* <input type="date" name="item_ex_date" id="item_ex_date" min="0" max="18" className="form-control input_design" placeholder="Enter Minimum Bid" value="" /> */}
                  <input
                    type="datetime-local"
                    value={(datetime || "").toString().substring(0, 16)}
                    //value={datetime}
                    onChange={handleChange}
                    className="input_design"
                  />
                </div>
                <div className="mt-5 mb-3 text-center">
                  <button
                    type="button"
                    className="square_yello"
                    onClick={PlaceOffer}
                  >
                    {haveOffer ? "Update Offer" : "Make Offers"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Bid/Offer Modal Ends*/}
      <Footer />
    </div>
  );
}

export default NFTDetails;
