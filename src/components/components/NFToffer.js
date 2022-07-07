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

function NFToffer(props) {
  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [offer, setOffer] = useState([]);
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [selectedTokenFS, setSelectedTokenFS] = useState("USDT");
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState();
  const [offerQuantity, setOfferQuantity] = useState(1);
  const [modal, setModal] = useState(false);
  const [marketplaceSaleType, setmarketplaceSaleType] = useState(0);

  useEffect(() => {
    console.log("cookies.selected_account", cookies.selected_account);
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    // else NotificationManager.error("Connect Yout Wallet", "", 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.selected_account]);

  useEffect(() => {
    const fetch = async () => {
      let searchParams = {
        nftID: props.id,
        buyerID: "All",
        bidStatus: "All",
        //orderID: "All",
      };
      console.log("fetch NFT is Called", searchParams);

      let _data = await fetchOfferNft(searchParams);
      console.log("offer data123", _data.data);
      if (_data && _data.data.length > 0) {
        let a = _data.data;

        setOffer(a);
        //console.log("offer is in ofeerererere------>",offer[0])
        //setOfferPrice(offer?offer[0].bidPrice
        //  :"")
        console.log("bid data", _data.data[0]);
      }
    };
    fetch();
  }, [props.id]);

  const PlaceOffer = async () => {
    console.log("update offer is called");
    setLoading(true);
    if (currentUser === undefined || currentUser === "") {
      NotificationManager.error("Please Connect Metamask");
      setLoading(false);
      return;
    }

    if (offerPrice == "" || offerPrice == undefined) {
      NotificationManager.error("Enter Offer Price");
      setLoading(false);
      return;
    }

    if (
      offerQuantity == "" ||
      (offerQuantity == undefined && NFTDetails.type !== 1)
    ) {
      NotificationManager.error("Enter Offer Quantity");
      setLoading(false);
      return;
    }
    if (datetime == "") {
      NotificationManager.error("Enter Offer EndTime");
      setLoading(false);
      return;
    }

    let deadline = moment(datetime).unix();
    let tokenAddress =
      marketplaceSaleType === 0
        ? contracts[selectedTokenFS]
        : contracts[selectedToken];
    await createOffer(
      props.NftDetails?.tokenId,
      props.collectionAddress,
      props.NftDetails?.ownedBy[0],
      currentUser,
      props.NftDetails?.type,
      offerQuantity,
      ethers.utils.parseEther(offerPrice),
      deadline,
      props.NftDetails.id,
      tokenAddress
    );

    setLoading(false);
    slowRefresh(1000);
    //await putOnMarketplace(currentUser, orderData);
    return;
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

  return (
    <div className='row'>
      {loading ? <Spinner /> : ""}
      <div className='col-md-12'>
        <div className='nft_list'>
          <table className='table text-light fixed_header'>
            <thead>
              <tr>
                <th>FROM</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>ENDS IN</th>
                <th>STATUS</th>
                <th className='text-center'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {offer && offer.length > 0
                ? offer.map((b, i) => {
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
                            src={"../img/favicon.png"}
                            className='img-fluid hunter_fav'
                          />{" "}
                          {Number(
                            convertToEth(b?.bidPrice?.$numberDecimal)
                          ).toFixed(4)}
                        </td>
                        <td>
                          {moment(b.createdOn).format("DD/MM/YYYY")}{" "}
                          <span className='nft_time'>
                            {moment(b.createdOn).format("HH:MM:SS")}
                          </span>
                        </td>
                        <td>
                          {" "}
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
                        <td className='white_text'>
                          {" "}
                          {b.bidStatus == "MakeOffer" ? "Active" : b.bidStatus}
                        </td>
                        <td className='text-center'>
                          {bidOwner === currentUser.toLowerCase() &&
                          b.bidStatus === "MakeOffer" ? (
                            <div className='d-flex justify-content-center align-items-center'>
                              <button
                                to={"/"}
                                className='small_yellow_btn small_btn mr-3'
                                onClick={async () => {
                                  setLoading(true);
                                  await handleAcceptOffers(
                                    b,
                                    props,
                                    currentUser.toLowerCase()
                                  );
                                  setLoading(false);
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
                          ) : bidOwner !== currentUser.toLowerCase() &&
                            bidder === currentUser.toLowerCase() ? (
                            <div className='d-flex justify-content-center align-items-center'>
                              <button
                                disabled={
                                  new Date(b.bidDeadline * 1000) < new Date()
                                }
                                className='small_yellow_btn small_btn mr-3'
                                data-bs-toggle='modal'
                                data-bs-target='#brandModal'
                                onClick={() => setModal("active")}>
                                Update Offer
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
                          ) : bidder === currentUser.toLowerCase() ? (
                            <button
                              to={"/"}
                              className='small_yellow_btn small_btn mr-3'>
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

      {/*update offer modal*/}
      <div className='modal marketplace' id='brandModal'>
        <div className='modal-dialog modal-lg modal-dialog-centered'>
          <div className='modal-content'>
            {/* <!-- Modal Header --> */}
            <div className='modal-header p-4'>
              <h4 className='text-light title_20 mb-0'>Offer</h4>
              <button
                type='button'
                className='btn-close text-light'
                data-bs-dismiss='modal'></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className='modal-body'>
              <div className='tab-content'>
                <div className='mb-3' id='tab_opt_1'>
                  <label htmlfor='item_price' className='form-label'>
                    Price
                  </label>
                  <input
                    type='text'
                    name='item_price'
                    id='item_price'
                    min='0'
                    max='18'
                    className='form-control input_design'
                    placeholder='Please Enter Price (MATIC)'
                    value={offerPrice}
                    onChange={(event) => setOfferPrice(event.target.value)}
                  />
                </div>
                <div className='mb-3' id='tab_opt_2'>
                  <label htmlfor='item_qt' className='form-label'>
                    Quantity
                  </label>
                  <input
                    type='text'
                    name='item_qt'
                    id='item_qt'
                    min='1'
                    disabled={NFTDetails.type === 1 ? "disabled" : ""}
                    className='form-control input_design'
                    placeholder='Please Enter Quantity'
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
                <div id='tab_opt_4' className='mb-3'>
                  <label htmlfor='Payment' className='form-label'>
                    Payment Token
                  </label>

                  {marketplaceSaleType === 0 ? (
                    <>
                      <select
                        className='form-select input_design select_bg'
                        name='USDT'
                        value={selectedTokenFS}
                        onChange={(event) => {
                          event.preventDefault();
                          event.persist();
                          console.log("selected token", selectedTokenFS);
                          setSelectedTokenFS(event.target.value);
                        }}>
                        {" "}
                        {/* <option value={"BNB"} selected>
                          BNB
                        </option>
                        <option value={"HNTR"}>HNTR</option> */}
                        <option value={"USDT"}>USDT</option>
                      </select>
                    </>
                  ) : marketplaceSaleType == 1 ? (
                    <>
                      <select
                        className='form-select input_design select_bg'
                        name='USDT'
                        value={selectedToken}
                        onChange={(event) =>
                          setSelectedToken(event.target.value)
                        }>
                        {" "}
                        <option value={"USDT"} selected>
                          USDT
                        </option>
                      </select>
                    </>
                  ) : (
                    <>
                      <select
                        className='form-select input_design select_bg'
                        name='USDT'
                        value={selectedToken}
                        onChange={(event) =>
                          setSelectedToken(event.target.value)
                        }>
                        <option value={"USDT"} selected>
                          USDT
                        </option>
                      </select>
                    </>
                  )}
                </div>

                <div id='tab_opt_5' className='mb-3 '>
                  <label for='item_ex_date' className='form-label'>
                    Expiration date
                  </label>
                  {/* <input type="date" name="item_ex_date" id="item_ex_date" min="0" max="18" className="form-control input_design" placeholder="Enter Minimum Bid" value="" /> */}
                  <input
                    type='datetime-local'
                    value={(datetime || "").toString().substring(0, 16)}
                    //value={datetime}
                    onChange={handleChange}
                    className='input_design'
                  />
                </div>
                <div className='mt-5 mb-3 text-center'>
                  <button
                    type='button'
                    className='square_yello'
                    href='/mintcollectionlive'
                    onClick={PlaceOffer}>
                    Place Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*update offer modal ends*/}
    </div>
  );
}

export default NFToffer;
