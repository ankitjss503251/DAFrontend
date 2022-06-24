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

function NFTlisting(props) {
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [bids, setBids] = useState([]);
  const [isPlaceBidModal, setIsPlaceBidModal] = useState(false);
  const [bidQty, setBidQty] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [willPay, setWillPay] = useState("");
  const [userBalance, setUserBalance] = useState(0);

  const placeBidCal = [
    {
      key: "Balance",
      value: userBalance,
    },
    {
      key: "You will pay",
      value: willPay,
    },
  ];

  useEffect(() => {
    console.log("cookies.selected_account", cookies.selected_account);
    if (cookies.selected_account) {
      setCurrentUser(cookies.selected_account);
      setUserBalance(cookies.balance);
    }
  }, [cookies.selected_account]);

  useEffect(() => {
    const fetch = async () => {
      if (props.id) {
        const _orders = await getOrderByNftID({ nftID: props.id });
        console.log("orders", _orders?.results?.length);
        setOrders(_orders?.results);
      }
    };
    fetch();
  }, [props.id]);

  const placeBidModal = (
    <PopupModal
      content={
        <div className='popup-content1'>
          <h3 className='modal_heading '>Complete Checkout</h3>
          <div className='bid_user_details my-4'>
            <img src={Logo} />

            <div className='bid_user_address'>
              <div>
                <span className='adr'>{`${
                  currentUser?.slice(0, 8) + "..." + currentUser?.slice(34, 42)
                }`}</span>
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
            disabled={""}
            value={bidQty}
            onKeyPress={(e) => {
              if (!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              // if (Number(e.target.value) > Number(100)) {
              //   NotificationManager.error(
              //     "Quantity should be less than seller's order",
              //     "",
              //     800
              //   );
              //   return;
              // }
              setBidQty(e.target.value);
              setWillPay(e.target.value * bidPrice);
            }}></input>
          <h6 className='enter_price_heading required'>
            Please Enter the Bid Price
          </h6>

          <input
            className='form-control checkout_input'
            type='text'
            min='1'
            placeholder='Price e.g. 0.001,1...'
            value={bidPrice}
            onKeyPress={(e) => {
              if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if (Number(e.target.value) > 100000000000000) {
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
                    if (val.length === 2 && val !== "0.") {
                      val = Number(val);
                    }
                  }
                } else {
                  if (val.split(".").length > 2) {
                    val = val.replace(/\.+$/, "");
                  }
                  if (val.length === 2 && val !== "0.") {
                    val = Number(val);
                  }
                }
                setBidPrice(val);
                setWillPay(val * bidQty);
              }
            }}></input>

          <div className='bid_user_calculations'>
            {placeBidCal?.map(({ key, value }) => {
              return (
                <div className='cal_div'>
                  <span>{key}</span>
                  <span className='cal_div_value'>{value} MATIC</span>
                </div>
              );
            })}
          </div>
 
          {Number(willPay) === 0 ? (
            ""
          ) : Number(willPay) > Number(userBalance) ? (
          <p className='disabled_text'>Insufficient Balance in MATIC</p>
          ) : (
          <button className='btn-main mt-2 btn-placeABid'>
            {"Place A Bid"}
          </button> )}
        </div>
      }
      handleClose={() => {
        setIsPlaceBidModal(!isPlaceBidModal);
        setBidQty(1);
        setBidPrice("");
        setWillPay("0");
      }}
    />
  );

  return (
    <div className='row'>
      {isPlaceBidModal ? placeBidModal : ""}
      <div className='col-md-12'>
        <div className='nft_list'>
          <table className='table text-light'>
            <thead>
              <tr>
                <th>FROM</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>SALE TYPE</th>
                <th>STATUS</th>
                <th className='text-center'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0
                ? orders.map((o, i) => {
                    return (
                      <tr>
                        <td className='d-flex justify-content-start align-items-center mb-0'>
                          <span className='yellow_dot circle_dot'></span>
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
                            alt=''
                            src={"../img/favicon.png"}
                            className='img-fluid hunter_fav'
                          />{" "}
                          {o.price && o.price.$numberDecimal
                            ? Number(
                                convertToEth(o.price.$numberDecimal)
                              ).toFixed(4)
                            : "0"}
                        </td>
                        <td>
                          {moment(o.createdOn).format("DD/MM/YYYY")}{" "}
                          <span className='nft_time'>
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
                        <td className='blue_text'>Active</td>
                        <td>
                          <div className='text-center'>
                            {o.sellerID?.walletAddress?.toLowerCase() ===
                            currentUser?.toLowerCase() ? (
                              <button
                                to={"/"}
                                className='small_yellow_btn small_btn mr-3'
                                onClick={() => {
                                  handleRemoveFromSale(o._id, currentUser);
                                }}>
                                Remove From Sale
                              </button>
                            ) : (
                              <button
                                to={"/"}
                                className='small_border_btn small_btn'
                                onClick={async () => {
                                  if (currentUser) {
                                    setIsPlaceBidModal(true);
                                    // o.salesType === 0
                                    //   ? await handleBuyNft(
                                    //       o._id,
                                    //       props?.NftDetails?.type == 1,
                                    //       currentUser,
                                    //       "1000000000000",
                                    //       1,
                                    //       false,
                                    //       props?.NftDetails?.collectionAddress?.toLowerCase()
                                    //     )
                                    //   : await createBid(
                                    //       o.nftID,
                                    //       o._id,
                                    //       o.sellerID?._id,
                                    //       currentUser,
                                    //       props?.NftDetails?.type,
                                    //       1,
                                    //       o.price.$numberDecimal
                                    //     );
                                  } else {
                                    console.log("wallet not found");
                                  }
                                }}>
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
