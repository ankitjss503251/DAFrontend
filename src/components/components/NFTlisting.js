import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrderByNftID } from "../../helpers/getterFunctions";
import { useCookies } from "react-cookie";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import {
  createBid,
  handleBuyNft,
  handleRemoveFromSale,
} from "../../helpers/sendFunctions";
import PopupModal from "../components/AccountModal/popupModal";
import Logo from "../../assets/images/logo.svg";
import Clock from "./Clock";
import { GENERAL_TIMESTAMP } from "../../helpers/constants";
import { Tokens } from "../../helpers/tokensToSymbol";

function NFTlisting(props) {
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [willPay, setWillPay] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [isBuyNowModal, setIsBuyNowModal] = useState(false);
  const [isPlaceBidModal, setIsPlaceBidModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [bidDeadline, setBidDeadline] = useState("");

  const checkoutCal = [
    {
      key: "Balance",
      value: Number(userBalance).toFixed(4),
    },
    {
      key: "You will pay",
      value: willPay,
    },
  ];

  useEffect(() => {
    if (cookies.selected_account) {
      setCurrentUser(cookies.selected_account);
      setUserBalance(cookies.balance);
    }
  }, [cookies.selected_account, cookies.balance]);

  useEffect(() => {
    const fetch = async () => {
      if (props.id) {
        const _orders = await getOrderByNftID({ nftID: props.id });
        console.log("orders", _orders?.results?.length);
        setOrders(_orders?.results);
      }
      console.log("tokens", Tokens);
    };
    fetch();
  }, [props.id]);

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
                <span class="badge badge-success">Connected</span>
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
            disabled={props ? props.NftDetails.type === 1 : false}
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
              setWillPay((e.target.value * price).toFixed(4));
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
              if (
                Number(e.target.value) > Number(currentOrder.total_quantity)
              ) {
                NotificationManager.error(
                  "Quantity should be less than seller's order",
                  "",
                  800
                );
                return;
              }
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
                console.log("valxqty", convertToEth(val * qty));
                setWillPay((val * qty).toFixed(4));
              }
            }}
          ></input>

          <div className="form-control checkout_input">
            <h6 className="enter_price_heading required">
              Bid Expiration date
            </h6>
            {/* <input type="date" name="item_ex_date" id="item_ex_date" min="0" max="18" className="form-control input_design" placeholder="Enter Minimum Bid" value="" /> */}
            <input
              className="form-control checkout_input"
              type="datetime-local"
              value={(bidDeadline || "").toString().substring(0, 16)}
              onChange={(ev) => {
                if (!ev.target["validity"].valid) return;
                const dt = ev.target["value"] + ":00Z";
                const ct = moment().toISOString();
                if (dt < ct) {
                  NotificationManager.error(
                    "Expiration date should not be of past date",
                    "",
                    800
                  );
                  return;
                }
                setBidDeadline(dt);
              }}
            />
          </div>

          <div className="bid_user_calculations">
            {checkoutCal?.map(({ key, value }) => {
              return (
                <div className="cal_div">
                  <span>{key}</span>
                  <span className="cal_div_value">{value} MATIC</span>
                </div>
              );
            })}
          </div>

          {Number(willPay) === 0 ? (
            ""
          ) : Number(willPay) > Number(userBalance) ? (
            <p className="disabled_text">Insufficient Balance in MATIC</p>
          ) : (
            <button
              className="btn-main mt-2 btn-placeABid"
              onClick={async () => {
                await createBid(
                  currentOrder.nftID,
                  currentOrder._id,
                  currentOrder.sellerID?._id,
                  currentUser,
                  props?.NftDetails?.type,
                  currentOrder.total_quantity,
                  currentOrder.price.$numberDecimal,
                  false,
                  new Date(bidDeadline).valueOf() / 1000
                );
              }}
            >
              {"Place A Bid"}
            </button>
          )}
        </div>
      }
      handleClose={() => {
        setIsPlaceBidModal(!isPlaceBidModal);
        setQty(1);
        setPrice("");
        setWillPay(0);
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
                <span class="badge badge-success">Connected</span>
              </div>
              <span className="pgn">Polygon</span>
            </div>
          </div>
          <h6 className="enter_quantity_heading required">
            Please Enter the Quantity
          </h6>
          <input
            className="form-control checkout_input"
            type="text"
            min="1"
            step="1"
            placeholder="Quantity e.g. 1,2,3..."
            disabled={props ? props.NftDetails.type === 1 : false}
            value={qty}
            onKeyPress={(e) => {
              if (!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if (
                Number(e.target.value) > Number(currentOrder.total_quantity)
              ) {
                NotificationManager.error(
                  "Quantity should be less than seller's order",
                  "",
                  800
                );
                return;
              }
              setQty(e.target.value);
              setWillPay((e.target.value * price).toFixed(4));
            }}
          ></input>
          <h6 className="enter_price_heading required">
            Please Enter the Price
          </h6>

          <input
            className="form-control checkout_input"
            type="text"
            min="1"
            placeholder="Price e.g. 0.001,1..."
            disabled={true}
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
                setWillPay((val * qty).toFixed(4));
              }
            }}
          ></input>

          <div className="bid_user_calculations">
            {checkoutCal?.map(({ key, value }) => {
              return (
                <div className="cal_div">
                  <span>{key}</span>
                  <span className="cal_div_value">{value} MATIC</span>
                </div>
              );
            })}
          </div>

          {Number(willPay) === 0 ? (
            ""
          ) : Number(willPay) > Number(userBalance) ? (
            <p className="disabled_text">Insufficient Balance in MATIC</p>
          ) : (
            <button
              className="btn-main mt-2 btn-placeABid"
              onClick={async () => {
                await handleBuyNft(
                  currentOrder._id,
                  props?.NftDetails?.type === 1,
                  currentUser,
                  cookies.balance,
                  currentOrder.total_quantity,
                  false,
                  props?.NftDetails?.collectionAddress?.toLowerCase()
                );
              }}
            >
              {"Buy Now"}
            </button>
          )}
        </div>
      }
      handleClose={() => {
        setIsBuyNowModal(!isBuyNowModal);
        setQty(1);
        setPrice("");
        setWillPay(0);
      }}
    />
  );

  return (
    <div className="row">
      {isPlaceBidModal ? placeBidModal : ""}
      {isBuyNowModal ? buyNowModal : ""}
      <div className="col-md-12">
        <div className="nft_list">
          <table className="table text-light">
            <thead>
              <tr>
                <th>FROM</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>SALE TYPE</th>
                <th>ENDS IN</th>
                <th>STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0
                ? orders.map((o, i) => {
                    return (
                      <tr>
                        <td className="d-flex justify-content-start align-items-center mb-0">
                          <span className="yellow_dot circle_dot"></span>
                          <span>
                            {o.sellerID && o.sellerID.walletAddress
                              ? o.sellerID.walletAddress.slice(0, 3) +
                                "..." +
                                o.sellerID.walletAddress.slice(39, 41)
                              : ""}
                          </span>
                        </td>
                        <td>
                          <img
                            alt=""
                            src={Tokens[o.paymentToken.toLowerCase()]}
                            className="img-fluid hunter_fav"
                          />{" "}
                          {o.price && o.price.$numberDecimal
                            ? Number(
                                convertToEth(o.price.$numberDecimal)
                              ).toFixed(4)
                            : "0"}
                        </td>
                        <td>
                          {moment(o.createdOn).format("DD/MM/YYYY")}{" "}
                          <span className="nft_time">
                            {moment(o.createdOn).format("LT")}
                          </span>
                        </td>
                        <td>
                          {o.salesType === 0
                            ? "Fixed Sale"
                            : o.salesType === 1
                            ? "Timed Auction"
                            : "Open for Bids"}
                        </td>
                        <td>
                          {o.deadline === GENERAL_TIMESTAMP ? (
                            "INFINITE"
                          ) : (
                            <Clock
                              deadline={moment(new Date(o.deadline * 1000))
                                .subtract({
                                  hours: 5,
                                  minutes: 30,
                                })
                                .toISOString()}
                            ></Clock>
                          )}
                        </td>

                        <td className="blue_text">
                          {new Date(o.deadline * 1000) < new Date()
                            ? "Ended"
                            : "Active"}
                        </td>
                        <td>
                          <div className="text-center">
                            {o.sellerID?.walletAddress?.toLowerCase() ===
                            currentUser?.toLowerCase() ? (
                              <button
                                to={"/"}
                                className="small_yellow_btn small_btn mr-3"
                                onClick={() => {
                                  handleRemoveFromSale(o._id, currentUser);
                                }}
                              >
                                Remove From Sale
                              </button>
                            ) : (
                              <button
                                to={"/"}
                                disabled={
                                  new Date(o.deadline * 1000) < new Date()
                                }
                                className="small_border_btn small_btn"
                                onClick={async () => {
                                  console.log(
                                    "new Date(o.deadline) > new Date()",
                                    new Date(o.deadline * 1000) > new Date()
                                  );
                                  if (
                                    new Date(o.deadline * 1000) < new Date()
                                  ) {
                                    NotificationManager.error(
                                      "Auction Ended",
                                      "",
                                      800
                                    );
                                    return;
                                  }
                                  if (currentUser) {
                                    console.log("ooooooooo", o);
                                    o.salesType === 0
                                      ? setPrice(
                                          Number(
                                            convertToEth(o.price.$numberDecimal)
                                          ).toFixed(4)
                                        )
                                      : setPrice("");
                                    props.NftDetails.type === 1 &&
                                    o.salesType === 0
                                      ? setWillPay(
                                          Number(
                                            convertToEth(o.price.$numberDecimal)
                                          ).toFixed(4) * qty
                                        )
                                      : setWillPay(0);
                                    setCurrentOrder(o);
                                    o.salesType === 0
                                      ? setIsBuyNowModal(true)
                                      : setIsPlaceBidModal(true);
                                  } else {
                                    NotificationManager.error(
                                      "wallet not connected",
                                      "",
                                      800
                                    );
                                    return;
                                  }
                                }}
                              >
                                {o.salesType === 0 ? "Buy Now" : "Place A Bid"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NFTlisting;
