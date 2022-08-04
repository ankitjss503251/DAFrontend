import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchBidNft } from "../../apiServices";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import {
  createBid,
  handleAcceptBids,
  handleUpdateBidStatus,
} from "../../helpers/sendFunctions";
import Clock from "./Clock";
import { Tokens } from "../../helpers/tokensToSymbol";
import PopupModal from "../components/AccountModal/popupModal";
import Logo from "../../assets/images/logo.svg";
import { slowRefresh } from "../../helpers/NotifyStatus";
import { ethers } from "ethers";
import Spinner from "./Spinner";
import { InsertHistory } from "./../../apiServices";
import { GENERAL_TIMESTAMP } from "../../helpers/constants";
import evt from "./../../events/events";
import { onboard } from "../menu/header";
import { WalletConditions } from "../components/WalletConditions";


function NFTBids(props) {
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [bids, setBids] = useState([]);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUpdateBidModal, setIsUpdateBidModal] = useState(false);
  const [currentBid, setCurrentBid] = useState([]);
  const [reloadContent, setReloadContent] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [walletVariable, setWalletVariable] = useState({});


  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
  }, [cookies.selected_account]);

  const fetch = async () => {
    let searchParams = {
      nftID: props.id,
      buyerID: "All",
      bidStatus: "Bid",
      orderID: "All",
    };

    let _data = await fetchBidNft(searchParams);
    if (_data && _data.data.length > 0) {
      setBids(_data.data);
    }
  };

  useEffect(() => {

    fetch();
  }, [props.id, reloadContent, props.refreshState]);

  useEffect(() => {
    var body = document.body;
    if (loading || isUpdateBidModal) {
      body.classList.add("overflow_hidden");
    } else {
      body.classList.remove("overflow_hidden");
    }
  }, [loading, isUpdateBidModal]);

  // Update Bid Checkout Modal

  const updateBidModal = (
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
            disabled={props ? props.NftDetails.type === 1 : false}
            value={qty}
            onKeyPress={(e) => {
              if (!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if (Number(e.target.value) > Number(currentBid?.total_quantity)) {
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
            Please Enter the Bid Amount
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
                Number(e.target.value) >
                Number(currentBid?.price?.$numberDecimal)
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
                    // if (val.length === 1 && val !== "0.") {
                    //   val = Number(val);
                    // }
                  }
                } else {
                  if (val.split(".").length > 2) {
                    val = val.replace(/\.+$/, "");
                  }
                  // if (val.length === 1 && val !== "0.") {
                  //   val = Number(val);
                  // }
                }
                setPrice(val);
              }
            }}
          ></input>

          <button
            className="btn-main mt-2 btn-placeABid"
            onClick={async () => {
              setIsUpdateBidModal(false);
              const wCheck = WalletConditions();
              if (wCheck !== undefined) {
                setShowAlert(wCheck);
                return;
              }
              setLoading(true);
              console.log(
                "Number(price)",
                Number(price) <
                Number(convertToEth(currentBid.price?.$numberDecimal)),
                Number(price),
                Number(convertToEth(currentBid.price?.$numberDecimal))
              );
              if (
                Number(price) <
                Number(convertToEth(currentBid.price?.$numberDecimal))
              ) {
                NotificationManager.error(
                  "Bid Price must be greater than minimum bid",
                  "",
                  800
                );
                setLoading(false);
                return;
              }
              try {
                let res = await createBid(
                  currentBid.nftID,
                  currentBid.orderID[0]._id,
                  currentBid.orderID[0].sellerID,
                  currentUser,
                  props?.NftDetails?.type,
                  currentBid.total_quantity,
                  ethers.utils.parseEther(price.toString()),
                  false
                );

                if (res !== false) {
                  let historyReqData = {
                    nftID: currentBid.nftID,
                    buyerID: localStorage.getItem('userId'),
                    sellerID: currentBid?.owner?._id,
                    action: "Bid",
                    type: "Updated",
                    price: ethers.utils.parseEther(price.toString()).toString(),
                    paymentToken: currentBid?.orderID[0]?.paymentToken,
                    quantity: qty,
                    createdBy: localStorage.getItem("userId"),
                  };
                  await InsertHistory(historyReqData);
                  slowRefresh(1000)
                  // setReloadContent(!reloadContent);
                  // await props.refreshState()
                  NotificationManager.success(
                    "Bid Updated Successfully",
                    "",
                    800
                  );
                  setLoading(false);
                  slowRefresh(1000);
                }
                else {
                  setLoading(false);
                  return;
                }



              } catch (e) {
                NotificationManager.error("Something went wrong", "", 800);
              }
            }}
          >
            {"Update Bid"}
          </button>
          {/* )} */}
        </div>
      }
      handleClose={() => {
        setIsUpdateBidModal(!isUpdateBidModal);
        setQty(1);
        setPrice("");
      }}
    />
  );

  return (
    <div className="row">

      {showAlert === "chainId" ? <PopupModal content={<div className='popup-content1'>
        <div className='bid_user_details my-4'>
          <img src={Logo} alt='' />
          <div className='bid_user_address'>

            <div >
              <div className="mr-3">Required Network ID:</div>
              <span className="adr">
                {cookies.chain_id}
              </span>

            </div>

          </div>
        </div>
        <button
          className='btn-main mt-2' onClick={async () => {
            const isSwitched = await onboard.setChain({
              chainId: process.env.REACT_APP_CHAIN_ID,
            });
            if (isSwitched)
              setShowAlert("");
          }}>
          {"Switch Network"}
        </button>
      </div>} handleClose={() => { setShowAlert(!showAlert) }} /> :
        showAlert === "account" ? <PopupModal content={
          <div className='popup-content1'>
            <div className='bid_user_details my-4'>
              <img src={Logo} alt='' />
              <div className='bid_user_address align-items-center'>
                <div>
                  <span className="adr text-muted">
                    {currentUser}
                  </span>
                  <span className='badge badge-success'>Connected</span>
                </div>
                <h4 className="mb-3">Please switch to connected wallet address or click logout to continue with the current wallet address by disconnecting the already connected account.</h4>
              </div>

              <button
                className='btn-main mt-2' onClick={() => { evt.emit("disconnectWallet") }}>
                {"Logout"}
              </button>
            </div>
          </div>} handleClose={() => { setShowAlert(!showAlert) }} /> :
          showAlert === "locked" ? <PopupModal content={<div className='popup-content1'>
            <div className='bid_user_details my-4'>
              <img src={Logo} alt='' />
              <div className='bid_user_address align-items-center'>
                <div>
                  <span className="adr text-muted">
                    {currentUser}
                  </span>
                  <span className='badge badge-success'>Connected</span>
                </div>
              </div>
              <h4 className="mb-3">Your wallet is locked. Please unlock your wallet and connect again.</h4>
            </div>
            <button
              className='btn-main mt-2' onClick={() => {
                evt.emit("disconnectWallet")
              }}>
              Connect Wallet
            </button>
          </div>} handleClose={() => { setShowAlert(!showAlert) }} /> : showAlert === "notConnected" ? <PopupModal content={<div className='popup-content1'>
            <div className='bid_user_details my-4'>
              <img src={Logo} alt='' />
              {/* <div className='bid_user_address align-items-center'>
                <div>
                  <span className="adr text-muted">
                    {walletVariable.sAccount}
                  </span>
                  <span className='badge badge-success'>Connected</span>
                </div>
              </div> */}
              <h4 className="mb-3">Please connect your wallet. </h4>
            </div>
            <button
              className='btn-main mt-2' onClick={() => {
                setShowAlert("");
                setIsUpdateBidModal(false);
                evt.emit("connectWallet")
              }}>
              Connect Wallet
            </button>
          </div>} handleClose={() => { setShowAlert(!showAlert) }} /> : ""}

      {loading ? <Spinner /> : ""}
      {isUpdateBidModal ? updateBidModal : ""}
      {bids && bids.length <= 0 ? (
        <div className="col-md-12">
          <h4 className="no_data_text text-muted">No Bids Available</h4>
        </div>
      ) : (
        <div className="table-responsive">
          <div className="col-md-12">
            <div className="nft_list">
              <table className="table text-light">
                <thead>
                  <tr>
                    <th scope="col">FROM</th>
                    <th scope="col">PRICE</th>
                    <th scope="col">DATE</th>
                    <th scope="col">SALE TYPE</th>
                    <th scope="col">ENDS IN</th>
                    <th scope="col">STATUS</th>
                    <th className="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {bids && bids.length > 0
                    ? bids.map((b, i) => {
                      const bidOwner = b?.owner?.walletAddress?.toLowerCase();
                      const bidder =
                        b?.bidderID?.walletAddress?.toLowerCase();
                      return (
                        <tr key={i}>
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
                              src={
                                b?.orderID?.length > 0
                                  ? Tokens[
                                    b?.orderID[0]?.paymentToken?.toLowerCase()
                                  ]?.icon
                                  : "-"
                              }
                              className="img-fluid hunter_fav"
                            />{" "}
                            {Number(
                              convertToEth(b?.bidPrice?.$numberDecimal)
                            ).toFixed(4)}{" "}
                            {Tokens[b?.orderID[0]?.paymentToken]?.symbolName}
                          </td>
                          <td>
                            {moment(b.createdOn).format("DD/MM/YYYY")}{" "}
                            <span className="nft_time">
                              {moment(b.createdOn).format("hh:mm A")}
                            </span>
                          </td>
                          <td>{b?.orderID[0]?.salesType === 1 && b.deadline !== GENERAL_TIMESTAMP
                            ? "Auction"
                            : "Open for Bids"}</td>
                          <td>
                            {moment.utc(b.bidDeadline * 1000).local().format() < moment(new Date()).format() ? <Clock
                              deadline={moment.utc(b.bidDeadline * 1000).local().format()} fetch={fetch}></Clock> : " --:--:--"}


                          </td>
                          <td className={moment.utc(b.bidDeadline * 1000).local().format() < moment(new Date()).format()
                            ? "red_text"
                            : "green_text"}>
                            {moment.utc(b.bidDeadline * 1000).local().format() < moment(new Date()).format()
                              ? "Ended"
                              : "Active"}
                          </td>
                          <td className="text-center">
                            {bidOwner === currentUser?.toLowerCase() && b.bidStatus === "Bid" ? (
                              <div className="d-flex flex-column justify-content-center align-items-center">
                                <button
                                  to={"/"}
                                  className="small_yellow_btn small_btn mb-3"
                                  onClick={async () => {
                                    const wCheck = WalletConditions();
                                    if (wCheck !== undefined) {
                                      setShowAlert(wCheck);
                                      return;
                                    }
                                    setLoading(true);
                                    const resp = await handleAcceptBids(
                                      b,
                                      props.NftDetails.type
                                    );
                                    // console.log("accept bid res", resp);
                                    if (resp !== false) {
                                      let historyReqData = {
                                        nftID: b.nftID,
                                        sellerID: localStorage.getItem('userId'),
                                        buyerID: b?.bidderID?._id,
                                        action: "Bid",
                                        type: "Accepted",
                                        price: b?.bidPrice?.$numberDecimal,
                                        paymentToken: b?.orderID[0]?.paymentToken,
                                        quantity: b?.bidQuantity,
                                        createdBy: localStorage.getItem("userId"),
                                      };
                                      await InsertHistory(historyReqData);
                                      setLoading(false);

                                    }
                                    else {
                                      setLoading(false);
                                    }
                                    slowRefresh(1000)
                                    // await props.refreshState()
                                    // setReloadContent(!reloadContent);
                                  }}
                                >
                                  Accept
                                </button>
                                <button
                                  to={"/"}
                                  className="small_border_btn small_btn"
                                  onClick={async () => {
                                    const wCheck = WalletConditions();
                                    if (wCheck !== undefined) {
                                      setShowAlert(wCheck);
                                      return;
                                    }
                                    await handleUpdateBidStatus(
                                      b._id,
                                      "Rejected"
                                    );


                                    let historyReqData = {
                                      nftID: b.nftID,
                                      sellerID: localStorage.getItem('userId'),
                                      buyerID: b?.bidderID?._id,
                                      action: "Bid",
                                      type: "Rejected",
                                      price: b?.bidPrice?.$numberDecimal,
                                      paymentToken: b?.orderID[0]?.paymentToken,
                                      quantity: b?.bidQuantity,
                                      createdBy: localStorage.getItem("userId"),
                                    };
                                    await InsertHistory(historyReqData);

                                    // setReloadContent(!reloadContent);
                                    // await props.refreshState()
                                    slowRefresh(1000)
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : bidOwner !== currentUser?.toLowerCase() &&
                              bidder === currentUser?.toLowerCase() && b.bidStatus === "Bid" ? (
                              <div className="d-flex flex-column justify-content-center align-items-center ">
                                <button
                                  disabled={
                                    moment.utc(b.bidDeadline * 1000).local().format() < moment(new Date()).format()
                                  }
                                  className="small_yellow_btn small_btn mb-2"
                                  onClick={() => {
                                    const wCheck = WalletConditions();
                                    if (wCheck !== undefined) {
                                      setShowAlert(wCheck);
                                      return;
                                    }
                                    setCurrentBid(b);
                                    setPrice(
                                      Number(
                                        convertToEth(
                                          b?.bidPrice?.$numberDecimal
                                        )
                                      )
                                    );
                                    setIsUpdateBidModal(true);

                                  }}
                                >
                                  Update Bid
                                </button>

                                <button
                                  disabled={
                                    moment.utc(b.bidDeadline * 1000).local().format() < moment(new Date()).format()
                                  }
                                  className="small_border_btn small_btn"
                                  onClick={async () => {
                                    const wCheck = WalletConditions();
                                    if (wCheck !== undefined) {
                                      setShowAlert(wCheck);
                                      return;
                                    }
                                    await handleUpdateBidStatus(
                                      b._id,
                                      "Cancelled"
                                    );


                                    let historyReqData = {
                                      nftID: b.nftID,
                                      sellerID: localStorage.getItem('userId'),
                                      buyerID: b?.bidderID?._id,
                                      action: "Bid",
                                      type: "Cancelled",
                                      price: b?.bidPrice?.$numberDecimal,
                                      paymentToken: b?.orderID[0]?.paymentToken,
                                      quantity: b?.bidQuantity,
                                      createdBy: localStorage.getItem("userId"),
                                    };
                                    await InsertHistory(historyReqData);
                                    // setReloadContent(!reloadContent);
                                    // await props.refreshState()
                                    slowRefresh(1000)
                                  }}

                                >
                                  Cancel
                                </button>
                              </div>
                            ) : bidder === currentUser?.toLowerCase() ? (
                              <button
                                to={"/"}
                                className="small_border_btn small_btn"
                                disabled={
                                  moment.utc(b.bidDeadline * 1000).local().format() < moment(new Date()).format()
                                }
                              >
                                Place Bid
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
      )}
    </div>
  );
}

export default NFTBids;