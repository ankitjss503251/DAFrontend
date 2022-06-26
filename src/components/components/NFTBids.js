import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function NFTBids(props) {
  console.log("Props in NFT offer", props);

  const [currentUser, setCurrentUser] = useState("");
  const [cookies] = useCookies([]);
  const [bids, setBids] = useState([]);

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

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="nft_list">
          <table className="table text-light fixed_header">
            <thead>
              <tr>
                <th>FROM</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>ENDS IN</th>
                <th>STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {bids && bids.length > 0
                ? bids.map((b, i) => {
                    const bidOwner = b?.owner?.walletAddress.toLowerCase();
                    const bidder = b?.bidderID?.walletAddress.toLowerCase();
                    return (
                      <tr>
                        <td className="d-flex justify-content-start align-items-center mb-0">
                          <span className="blue_dot circle_dot"></span>
                          <span>
                            {b?.bidderID?.walletAddress
                              ? b?.bidderID?.walletAddress.slice(0, 3) +
                                "..." +
                                b?.bidderID?.walletAddress.slice(39, 41)
                              : ""}
                          </span>
                        </td>
                        <td>
                          <img
                            alt=""
                            src={"../img/favicon.png"}
                            className="img-fluid hunter_fav"
                          />{" "}
                          {Number(
                            convertToEth(b?.bidPrice?.$numberDecimal)
                          ).toFixed(4)}
                        </td>
                        <td>
                          {moment(b.createdOn).format("DD/MM/YYYY")}{" "}
                          <span className="nft_time">
                            {moment(b.createdOn).format("HH:MM:SS")}
                          </span>
                        </td>
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
                              .toISOString()}
                          ></Clock>
                        </td>
                        <td className="blue_text">
                          {new Date(b.bidDeadline * 1000) < new Date()
                            ? "Ended"
                            : "Active"}
                        </td>
                        <td className="text-center">
                          {bidOwner === currentUser.toLowerCase() ? (
                            <div className="text-center">
                              <button
                                to={"/"}
                                className="small_yellow_btn small_btn mr-3"
                                onClick={async () => {
                                  await handleAcceptBids(
                                    b,
                                    props.NftDetails.type
                                  );
                                }}
                              >
                                Accept
                              </button>
                              <button
                                to={"/"}
                                className="small_border_btn small_btn"
                                onClick={async () => {
                                  await handleUpdateBidStatus(
                                    b._id,
                                    "Rejected"
                                  );
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : bidOwner !== currentUser.toLowerCase() &&
                            bidder === currentUser.toLowerCase() ? (
                            <div className="text-center">
                              <button
                                disabled={
                                  new Date(b.bidDeadline * 1000) < new Date()
                                }
                                className="small_yellow_btn small_btn mr-3"
                              >
                                Update Bid
                              </button>
                              <button
                                disabled={
                                  new Date(b.bidDeadline * 1000) < new Date()
                                }
                                className="small_border_btn small_btn"
                                onClick={async () => {
                                  await handleUpdateBidStatus(
                                    b._id,
                                    "Cancelled"
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : bidder === currentUser.toLowerCase() ? (
                            <button
                              to={"/"}
                              className="small_border_btn small_btn"
                            >
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