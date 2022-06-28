import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchBidNft } from "../../apiServices";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import {
  handleAcceptBids,
  handleUpdateBidStatus,
} from "../../helpers/sendFunctions";
import NFTDetails from "../pages/NFTDetails";
import Clock from "./Clock";
import { Tokens } from "../../helpers/tokensToSymbol";
import PopupModal from "../components/AccountModal/popupModal";
import Logo from "../../assets/images/logo.svg";

function NFTBids(props) {
  console.log("Props in NFT offer", props);

  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [bids, setBids] = useState([]);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [willPay, setWillPay] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [isUpdateBidModal, setIsUpdateBidModal] = useState(false);
  const [currentBid, setCurrentBid] = useState([]);
  const [bidDeadline, setBidDeadline] = useState("");

  // const checkoutCal = [
  //   {
  //     key: "Balance",
  //     value: Number(userBalance).toFixed(4),
  //   },
  //   {
  //     key: "You will pay",
  //     value: willPay,
  //   },
  // ];

  useEffect(() => {
    console.log("cookies.selected_account", cookies.selected_account);
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    // else NotificationManager.error("Connect Your Wallet", "", 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.selected_account]);

  useEffect(() => {
    const fetch = async () => {
      let searchParams = {
        nftID: props.id,
        buyerID: "All",
        bidStatus: "All",
        orderID: "All",
      };

      let _data = await fetchBidNft(searchParams);
      console.log("bid data123", _data);
      if (_data && _data.data.length > 0) {
        setBids(_data.data);
        console.log("bid data", _data.data);
      }
    };
    fetch();
  }, [props.id]);

  // Update Bid Checkout Modal

  const updateBidModal = (
    <PopupModal
      content={
        <div className='popup-content1'>
          <h3 className='modal_heading '>Complete Checkout</h3>
          <div className='bid_user_details my-4'>
            <img src={Logo} alt='' />

            <div className='bid_user_address'>
              <div>
                <span className='adr'>
                  {currentUser?.slice(0, 8) +
                    "..." +
                    currentUser?.slice(34, 42)}
                </span>
                <span class='badge badge-success'>Connected</span>
              </div>
              <span className='pgn'>Polygon</span>
            </div>
          </div>
          <h6 className='enter_quantity_heading required'>
            Please Enter the Bid Quantity
          </h6>
          <input
            className='form-control checkout_input'
            type='text'
            min='1'
            step='1'
            placeholder='Quantity e.g. 1,2,3...'
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
            }}></input>
          <h6 className='enter_price_heading required'>
            Please Enter the Bid Price
          </h6>

          <input
            className='form-control checkout_input'
            type='text'
            min='1'
            placeholder='Price e.g. 0.001,1...'
            value={price}
            onKeyPress={(e) => {
              if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if (Number(e.target.value) > Number(currentBid.total_quantity)) {
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
            }}></input>

          <div className='form-control checkout_input'>
            <h6 className='enter_price_heading required'>
              Bid Expiration date
            </h6>
            {/* <input type="date" name="item_ex_date" id="item_ex_date" min="0" max="18" className="form-control input_design" placeholder="Enter Minimum Bid" value="" /> */}
            <input
              className='form-control checkout_input'
              type='datetime-local'
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
                console.log("dtt", dt);
              }}
            />
          </div>

          {/* <div className='bid_user_calculations'>
            {checkoutCal?.map(({ key, value }) => {
              return (
                <div className='cal_div'>
                  <span>{key}</span>
                  <span className='cal_div_value'>{value} MATIC</span>
                </div>
              );
            })}
          </div> */}

          {/* {Number(willPay) === 0 ? (
            ""
          ) : Number(willPay) > Number(userBalance) ? (
            <p className='disabled_text'>Insufficient Balance in MATIC</p>
          ) : ( */}
          <button className='btn-main mt-2 btn-placeABid' onClick={async () => {
         
          }}>
            {"Update Bid"}
          </button>
          {/* )} */}
        </div>
      }
      handleClose={() => {
        setIsUpdateBidModal(!isUpdateBidModal);
        setQty(1);
        setPrice("");
        setWillPay(0);
      }}
    />
  );

  return (
    <div className='row'>
      {isUpdateBidModal ? updateBidModal : ""}
      <div className='col-md-12'>
        <div className='nft_list'>
          <table className='table text-light fixed_header'>
            <thead>
              <tr>
                <th>FROM</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>SALE TYPE</th>
                <th>ENDS IN</th>
                <th>STATUS</th>
                <th className='text-center'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {bids && bids.length > 0
                ? bids.map((b, i) => {
                    const bidOwner = b?.owner?.walletAddress?.toLowerCase();
                    const bidder = b?.bidderID?.walletAddress?.toLowerCase();
                    return (
                      <tr>
                        <td className='d-flex justify-content-start align-items-center mb-0'>
                          <span className='blue_dot circle_dot'></span>
                          <span>
                            {b?.bidderID?.walletAddress
                              ? b?.bidderID?.walletAddress?.slice(0, 3) +
                                "..." +
                                b?.bidderID?.walletAddress?.slice(39, 41)
                              : ""}
                          </span>
                        </td>
                        <td>
                          <img
                            alt=''
                            src={
                              b.orderID.length > 0
                                ? Tokens[
                                    b.orderID[0]?.paymentToken?.toLowerCase()
                                  ]
                                : "-"
                            }
                            className='img-fluid hunter_fav'
                          />{" "}
                          {Number(
                            convertToEth(b?.bidPrice?.$numberDecimal)
                          ).toFixed(4)}
                        </td>
                        <td>
                          {moment(b.createdOn).format("DD/MM/YYYY")}{" "}
                          <span className='nft_time'>
                            {moment(b.createdOn).format("LT")}
                          </span>
                        </td>
                        <td>Auction</td>
                        <td>
                          {console.log(
                            "b.deadline",
                            new Date(b.bidDeadline * 1000) < new Date()
                          )}
                          <Clock
                            deadline={moment(new Date(b.bidDeadline * 1000))
                              .subtract({
                                hours: 5,
                                minutes: 30,
                              })
                              .toISOString()}></Clock>
                        </td>
                        <td className='blue_text'>
                          {new Date(b.bidDeadline * 1000) < new Date()
                            ? "Ended"
                            : "Active"}
                        </td>
                        <td className='text-center'>
                          {bidOwner === currentUser?.toLowerCase() ? (
                            <div className='d-flex justify-content-center align-items-center'>
                              <button
                                to={"/"}
                                className='small_yellow_btn small_btn mr-3'
                                onClick={async () => {
                                  await handleAcceptBids(
                                    b,
                                    props.NftDetails.type
                                  );
                                }}>
                                Accept
                              </button>
                              <button
                                to={"/"}
                                className='small_border_btn small_btn'
                                onClick={async () => {
                                  await handleUpdateBidStatus(
                                    b._id,
                                    "Rejected"
                                  );
                                }}>
                                Reject
                              </button>
                            </div>
                          ) : bidOwner !== currentUser?.toLowerCase() &&
                            bidder === currentUser?.toLowerCase() ? (
                            <div className='d-flex justify-content-center align-items-center'>
                              <button
                                disabled={
                                  new Date(b.bidDeadline * 1000) < new Date()
                                }
                                className='small_yellow_btn small_btn mr-3'
                                onClick={() => {
                                  setCurrentBid(b);
                                  setBidDeadline(
                                    moment(b.bidDeadline * 1000)
                                      .utc()
                                      .format()
                                  );
                                  setPrice(
                                    Number(
                                      convertToEth(b?.bidPrice?.$numberDecimal)
                                    ).toFixed(4)
                                  );
                                  setIsUpdateBidModal(true);
                                  console.log(
                                    "current bid--->",
                                    b,
                                    moment(b.bidDeadline * 1000)
                                      .utc()
                                      .format()
                                  );
                                }}>
                                Update Bid
                              </button>
                              <button
                                disabled={
                                  new Date(b.bidDeadline * 1000) < new Date()
                                }
                                className='small_border_btn small_btn'
                                onClick={async () => {
                                  await handleUpdateBidStatus(
                                    b._id,
                                    "Cancelled"
                                  );
                                }}>
                                Cancel
                              </button>
                            </div>
                          ) : bidder === currentUser?.toLowerCase() ? (
                            <button
                              to={"/"}
                              className='small_border_btn small_btn'>
                              Place a Bid
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
    </div>
  );
}

export default NFTBids;
