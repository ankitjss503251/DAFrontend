import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { fetchOfferNft } from "../../apiServices";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import { ethers } from "ethers";
import contracts from "../../config/contracts";
import {
  handleUpdateBidStatus,
  handleAcceptOffers,
  createOffer,
} from "../../helpers/sendFunctions";
import NFTDetails from "../pages/NFTDetails";
import { slowRefresh } from "../../helpers/NotifyStatus";
import Clock from "./Clock";
import Spinner from "../components/Spinner";
import { Tokens } from "../../helpers/tokensToSymbol";
import { InsertHistory } from "../../apiServices";

function NFToffer(props) {
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [offer, setOffer] = useState([]);
  const [selectedToken, setSelectedToken] = useState("BUSD");
  const [selectedTokenFS, setSelectedTokenFS] = useState("BNB");
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState();
  const [offerQuantity, setOfferQuantity] = useState(1);
  const [modal, setModal] = useState(false);
  const [marketplaceSaleType, setmarketplaceSaleType] = useState(0);


  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    // else NotificationManager.error("Connect Yout Wallet", "", 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.selected_account]);

  useEffect(() => {
    if (props.id)
      fetch();
  }, [props.id]);

  const fetch = async () => {
    let searchParams = {
      nftID: props.id,
      buyerID: "All",
      bidStatus: "All",
      //orderID: "All",
    };

    let _data = await fetchOfferNft(searchParams);
    if (_data && _data.data.length > 0) {
      let a = _data.data;

      setOffer(a);

    }
  };

  const PlaceOffer = async () => {
    setLoading(true);
    if (currentUser === undefined || currentUser === "") {
      NotificationManager.error("Please Connect Metamask");
      setLoading(false);
      return;
    }

    if (offerPrice === "" || offerPrice == undefined) {
      NotificationManager.error("Enter Offer Price");
      setLoading(false);
      return;
    }

    if (
      offerQuantity === "" ||
      (offerQuantity === undefined && NFTDetails?.type !== 1)
    ) {
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

    const res = await createOffer(
      props.NftDetails?.tokenId,
      props.collectionAddress,
      props.NftDetails?.ownedBy[0],
      currentUser,
      props.NftDetails?.type,
      offerQuantity,
      ethers.utils.parseEther(offerPrice),
      deadline,
      props.NftDetails.id,
      contracts[selectedToken]
    );

    if (res == false) {
      setLoading(false);
      return;
    }
    else {
      let historyReqData = {
        nftID: NFTDetails.id,
        buyerID: localStorage.getItem("userId"),
        action: "Offer",
        type: "Updated",
        price: ethers.utils.parseEther(offerPrice.toString()).toString(),
        paymentToken: contracts[selectedToken],
        quantity: offerQuantity,
        createdBy: localStorage.getItem("userId"),
      }
      const d = await InsertHistory(historyReqData);
      setLoading(false);
      await fetch()
      setModal("inactive")
    }
  };

  function handleChange(ev) {
    if (!ev.target["validity"].valid) return;

    const dt = ev.target["value"];

    const ct = moment().add({ 'hours': 5, 'minutes': 30 }).toISOString();

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

  return (
    <div className="row">
      {loading ? <Spinner /> : ""}
      {offer && offer.length <= 0 ? <div className="col-md-12">
        <h4 className="no_data_text text-muted">No Offers Available</h4>
      </div> : <div className="table-responsive">
        <div className="col-md-12">
          <div className="nft_list">
            <table className="table text-light fixed_header">
              <thead>
                <tr>
                  <th scope="col">FROM</th>
                  <th scope="col">PRICE</th>
                  <th scope="col">DATE</th>
                  <th scope="col">ENDS IN</th>
                  <th scope="col">STATUS</th>
                  <th className="text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {offer && offer.length > 0
                  ? offer.map((b, i) => {

                    const bidOwner = b?.owner?.walletAddress?.toLowerCase();
                    const bidder = b?.bidderID?.walletAddress?.toLowerCase();
                    return (
                      <tr>
                        <td className="d-flex justify-content-start align-items-center mb-0">
                          <span className="blue_dot circle_dot"></span>
                          <span>
                            {b?.bidderID?.walletAddress
                              ? b?.bidderID?.walletAddress?.slice(0, 4) +
                              "..." +
                              b?.bidderID?.walletAddress?.slice(38, 42)
                              : ""}
                          </span>
                        </td>
                        <td>
                          <img
                            alt=""
                            src={Tokens[b?.paymentToken?.toLowerCase()]?.icon}
                            className="img-fluid hunter_fav"
                          />{" "}
                          {Number(
                            convertToEth(b?.bidPrice?.$numberDecimal)
                          ).toFixed(4)}{" "}
                          {Tokens[b?.paymentToken?.toLowerCase()]?.symbolName}
                        </td>
                        <td>
                          {moment.utc(b.createdOn).local().format("DD/MM/YYYY")}{" "}
                          <span className="nft_time">
                            {moment.utc(b.createdOn).local().format("hh:mm a")}
                          </span>
                        </td>
                        <td>
                          <Clock
                            deadline={moment.utc(b.bidDeadline * 1000).local().format()}
                            fetch={fetch}
                          ></Clock>
                        </td>
                        <td className="white_text">
                          {" "}
                          {
                            moment.utc(b?.bidDeadline * 1000).local().format() < moment(new Date()).format() ? "Ended" :
                              b.bidStatus === "MakeOffer" ? "Active" : b.bidStatus}
                        </td>
                        <td className="text-center">
                          {bidOwner === currentUser.toLowerCase() &&
                            b.bidStatus === "MakeOffer" ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <button
                                to={"/"}
                                className="small_yellow_btn small_btn mr-3"
                                disabled={
                                  moment.utc(b?.bidDeadline * 1000).local().format() < moment(new Date()).format()
                                }
                                onClick={async () => {
                                  console.log("offer accept click", b)
                                  setLoading(true);
                                  await handleAcceptOffers(
                                    b,
                                    props,
                                    currentUser.toLowerCase()
                                  );
                                  let historyReqData = {
                                    nftID: b?.nftID,
                                    sellerID: localStorage.getItem('userId'),
                                    buyerID: b?.bidderID?._id,
                                    action: "Offer",
                                    type: "Accepted",
                                    price: b?.bidPrice?.$numberDecimal,
                                    paymentToken: b?.paymentToken,
                                    quantity: b?.bidQuantity,
                                    createdBy: localStorage.getItem("userId"),
                                  };
                                  await InsertHistory(historyReqData);
                                  await fetch()
                                  setLoading(false);
                                }}
                              >
                                Accept
                              </button>
                              <button
                                to={"/"}
                                className="small_border_btn small_btn"
                                disabled={
                                  moment.utc(b?.bidDeadline * 1000).local().format() < moment(new Date()).format()
                                }
                                onClick={async () => {
                                  await handleUpdateBidStatus(
                                    b._id,
                                    "Rejected"
                                  );
                                  let historyReqData = {
                                    nftID: b?.nftID,
                                    sellerID: localStorage.getItem('userId'),
                                    buyerID: b?.bidderID?._id,
                                    action: "Offer",
                                    type: "Rejected",
                                    price: b?.bidPrice?.$numberDecimal,
                                    paymentToken: b?.paymentToken,
                                    quantity: b?.bidQuantity,
                                    createdBy: localStorage.getItem("userId"),
                                  };
                                  await InsertHistory(historyReqData);
                                  await fetch()
                                }}

                              >
                                Reject
                              </button>
                            </div>
                          ) : bidOwner !== currentUser.toLowerCase() &&
                            bidder === currentUser.toLowerCase() ? (
                            <div
                              className={`d-${b.bidStatus === "Accepted" ? "none" : "flex"
                                } justify-content-center align-items-center`}
                            >
                              <button

                                className="small_yellow_btn small_btn mr-3"
                                data-bs-toggle="modal"
                                data-bs-target="#brandModal"
                                onClick={() => {
                                  setModal("active");

                                  setOfferPrice(
                                    convertToEth(b?.bidPrice?.$numberDecimal)
                                  );
                                  setDatetime(
                                    moment.utc(b?.bidDeadline * 1000).local().format()
                                  );
                                }}
                              >
                                Update Offer
                              </button>
                              <button
                                className="small_border_btn small_btn"
                                onClick={async () => {
                                  await handleUpdateBidStatus(
                                    b._id,
                                    "Cancelled"
                                  );
                                  let historyReqData = {
                                    nftID: b?.nftID,
                                    sellerID: localStorage.getItem('userId'),
                                    buyerID: b?.bidderID?._id,
                                    action: "Offer",
                                    type: "Cancelled",
                                    price: b?.bidPrice?.$numberDecimal,
                                    paymentToken: b?.paymentToken,
                                    quantity: b?.bidQuantity,
                                    createdBy: localStorage.getItem("userId"),
                                  };
                                  await InsertHistory(historyReqData);
                                  await fetch()
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : bidder === currentUser.toLowerCase() ? (
                            <button
                              to={"/"}
                              className="small_yellow_btn small_btn mr-3"
                            >
                              Update Offer
                            </button>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  })
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>}


      {/*update offer modal*/}
      <div className={`modal marketplace ${modal}`} id="brandModal">
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
                    placeholder="Please Enter Price (MATIC)"
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

                          }
                        } else {
                          if (val.split(".").length > 2) {
                            val = val.replace(/\.+$/, "");
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
                    disabled={NFTDetails.type === 1 ? "disabled" : ""}
                    className="form-control input_design"
                    placeholder="Please Enter Quantity"
                    value={offerQuantity}
                    onChange={(event) => {
                      if (NFTDetails.type == 1 && event.target.value > 1) {
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
                        name="BUSD"
                        value={selectedTokenFS}
                        onChange={(event) => {
                          event.preventDefault();
                          event.persist();
                          setSelectedTokenFS(event.target.value);
                        }}
                      >
                        {" "}
                        {/* <option value={"BNB"} selected>
                          BNB
                        </option>
                        <option value={"HNTR"}>HNTR</option> */}
                        <option value={"BUSD"}>BUSD</option>
                      </select>
                    </>
                  ) : marketplaceSaleType == 1 ? (
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
                    href="/mintcollectionlive"
                    onClick={PlaceOffer}
                  >
                    Update Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*update offer modal ends*/}
    </div >
  );
}

export default NFToffer;
