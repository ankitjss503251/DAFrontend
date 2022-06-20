import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import FirearmsCollection from "../components/FirearmsCollection";
import NFTlisting from "../components/NFTlisting";
import NFToffer from "../components/NFToffer";
import NFThistory from "../components/NFThistory";
import {
  getCollections,
  getNFTs,
  getOrderByNftID,
} from "../../helpers/getterFunctions";
import { useParams } from "react-router-dom";
import { convertToEth } from "../../helpers/numberFormatter";
import { putOnMarketplace } from "../../helpers/sendFunctions";
import { useCookies } from "react-cookie";
import contracts from "../../config/contracts";
import { GENERAL_TIMESTAMP, ZERO_ADDRESS } from "../../helpers/constants";
import { NotificationManager } from "react-notifications";

var bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};
var textColor = {
  textColor: "#EF981D",
};

function NFTDetails() {
  const { id } = useParams();

  const [NFTDetails, setNFTDetails] = useState([]);
  const [allNFTs, setAllNFTs] = useState([]);
  const [collection, setCollection] = useState([]);
  const [marketplaceSaleType, setmarketplaceSaleType] = useState(0);
  const [itemprice, setItemprice] = useState(0);
  const [item_qt, setItem_qt] = useState(1);
  const [item_bid, setItem_bid] = useState(0);
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [datetime, setDatetime] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [cookies] = useCookies([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Wallet", "", 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.selected_account]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const reqData = {
          page: 1,
          limit: 12,
          nftID: id,
        };
        const res = await getNFTs(reqData);

        setNFTDetails(res[0]);
        const c = await getCollections({ collectionID: res[0].collection });
        console.log("in here", c[0]);
        setCollection(c[0]);
        const reqData1 = {
          page: 1,
          limit: 12,
          collectionID: res[0].collection,
        };
        const nfts = await getNFTs(reqData1);

        setAllNFTs(nfts);
        const _orders = await getOrderByNftID({ nftID: nfts.id });
        console.log("orders", _orders);
        setOrders(_orders?.results);
      } catch (e) {
        console.log("Error in fetching nft Details", e);
      }
    };
    fetch();
  }, [id]);

  const PutMarketplace = async () => {
    console.log("sale type", marketplaceSaleType);

    console.log("contracts[selectedToken]", contracts[selectedToken]);
    let orderData = {
      nftId: NFTDetails.id,
      collection: NFTDetails.collectionAddress,
      price: itemprice ? itemprice : "0",
      quantity: item_qt,
      saleType: marketplaceSaleType === 1 || marketplaceSaleType === 2 ? 1 : 0,
      salt: Math.round(Math.random() * 10000000),
      endTime: datetime ? datetime : GENERAL_TIMESTAMP,
      chosenType: marketplaceSaleType,
      minimumBid: item_bid !== "" ? item_bid : 0,
      // auctionEndDate: endTime ? endTime : new Date(GENERAL_DATE),
      tokenAddress:
        marketplaceSaleType === 0 ? ZERO_ADDRESS : contracts[selectedToken],
      tokenId: NFTDetails.tokenId,
      erc721: NFTDetails.type === 1,
    };
    await putOnMarketplace(currentUser, orderData);
  };

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
    document.getElementById("tab_opt_5").classList.remove("put_hide");
    document.getElementById("tab_opt_5").classList.add("put_show");
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
    // const dt = ev.target["value"] + ":00Z";
    setDatetime(new Date(ev.target.value));
  }

  return (
    <div>
      <section style={bgImgStyle} className="pdd_8">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-6 mb-xl-5 mb-lg-5 mb-5">
              <img
                src={NFTDetails?.image}
                className="img-fluid nftimg"
                alt=""
              />
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
                  <span style={textColor}>{collection?.createdBy}</span>
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
              <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
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
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Background <span className="big_text">Bunker</span>
                        </p>
                        <p>
                          85% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-75"
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Eyes <span>Alert</span>
                        </p>
                        <p>
                          14% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-25"
                          role="progressbar"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Camouflage <span className="big_text">Jungle</span>
                        </p>
                        <p>
                          45% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Mouth <span>Neutral</span>
                        </p>
                        <p>
                          61% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Weapon <span className="big_text">Pistol</span>
                        </p>
                        <p>
                          27% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-25"
                          role="progressbar"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Hair <span>Short</span>
                        </p>
                        <p>
                          35% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Accessories <span className="big_text">Grenade</span>
                        </p>
                        <p>
                          33% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-25"
                          role="progressbar"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Hat <span>None</span>
                        </p>
                        <p>
                          63% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-50"
                          role="progressbar"
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="tab_label">
                        <p>
                          Accessories{" "}
                          <span className="big_text">Ammo mags</span>
                        </p>
                        <p>
                          95% <span>have this traits</span>
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar w-75"
                          role="progressbar"
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="price_box">
                <h4>Price</h4>
                <div className="price_div">
                  <img
                    src={"../img/favicon.png"}
                    className="img-fluid"
                    alt=""
                  />
                  {Number(convertToEth(collection?.price)).toFixed(4)} HNTR
                </div>
                <button
                  type="button"
                  className="yellow_btn mr-3 mb-3"
                  data-bs-toggle="modal"
                  data-bs-target="#detailPop"
                >
                  {orders.length > 0
                    ? orders?.sellerID?.walletAddress?.toLowerCase() ===
                      currentUser?.toLowerCase()
                      ? "Remove From Sale"
                      : "Buy Now"
                    : NFTDetails &&
                      NFTDetails.ownedBy &&
                      NFTDetails.ownedBy.length > 0
                    ? NFTDetails.ownedBy[0]?.address
                    : ""?.toLowerCase() === currentUser.toLowerCase()
                    ? "Put On Marketplace"
                    : ""}
                </button>
                <button type="button" className="border_btn title_color">
                  Bids / Offers
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-5 width_45 auto_right">
              <h3 className="title_36 mb-4">Description</h3>
              <p className="textdes">{NFTDetails?.desc} </p>
            </div>
            <div className="col-lg-6 mb-5">
              <h3 className="title_36 mb-4">
                About {collection?.name} Collection
              </h3>
              <div className="row">
                <div className="col-md-4 nftDetails_img_con">
                  <img src={collection?.logoImg} alt="" className="img-fluid" />
                </div>
                <div className="col-md-8">
                  <p className="textdes">{collection?.description} </p>
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
                <NFTlisting id={NFTDetails.id} />
              </div>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Offers</h3>
              <div className="table-responsive">
                <NFToffer />
              </div>
            </div>
            <div className="col-md-12 mb-5">
              <h3 className="title_36 mb-4">Histoy</h3>
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
                      href={`/marketplacecollection/${collection?.name}`}
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
      <div className="modal markitplace" id="detailPop">
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
                <div className="mb-3" id="tab_opt_1">
                  <label htmlfor="item_price" className="form-label">
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
                    onChange={(event) => setItemprice(event.target.value)}
                  />
                </div>
                <div className="mb-3" id="tab_opt_2">
                  <label htmlfor="item_qt" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="item_qt"
                    id="item_qt"
                    min="1"
                    disabled=""
                    className="form-control input_design"
                    placeholder="Please Enter Quantity"
                    value={item_qt}
                    onChange={(event) => setItem_qt(event.target.value)}
                  />
                </div>
                <div id="tab_opt_3" className="mb-3 put_hide">
                  <label htmlfor="item_bid" className="form-label">
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
                    onChange={(event) => setItem_bid(event.target.value)}
                  />
                </div>
                <div id="tab_opt_4" className="mb-3 put_hide">
                  <label htmlfor="Payment" className="form-label">
                    Payment Token
                  </label>
                  <select
                    className="form-select input_design select_bg"
                    name="USDT"
                    value={selectedToken}
                    onChange={(event) => setSelectedToken(event.target.value)}
                  >
                    <option selected>USDT</option>
                    <option value="1">USDT 1</option>
                    <option value="2">USDT 2</option>
                  </select>
                </div>
                <div id="tab_opt_5" className="mb-3 put_hide">
                  <label for="item_ex_date" className="form-label">
                    Expiration date
                  </label>
                  {/* <input type="date" name="item_ex_date" id="item_ex_date" min="0" max="18" className="form-control input_design" placeholder="Enter Minimum Bid" value="" /> */}
                  <input
                    type="datetime-local"
                    value={(datetime || "").toString().substring(0, 16)}
                    onChange={handleChange}
                    className="input_design"
                  />
                </div>
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
      <Footer />
    </div>
  );
}

export default NFTDetails;
