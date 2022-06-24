import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { fetchBidNft } from "../../apiServices";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import { handleAcceptBids } from "../../helpers/sendFunctions";
import NFTDetails from "../pages/NFTDetails";

function NFToffer(props) {
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
          <table className="table text-light">
            <thead>
              <tr>
                <th>FROM</th>
                <th>PRICE</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {bids && bids.length > 0
                ? bids.map((b, i) => {
                    return (
                      <tr>
                        <td>
                          <span className="blue_dot circle_dot"></span>
                          {b?.bidderID?.walletAddress
                            ? b?.bidderID?.walletAddress.slice(0, 3) +
                              "..." +
                              b?.bidderID?.walletAddress.slice(39, 41)
                            : ""}
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
                        <td className="red_text">Cancelled</td>
                        <td>
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
                            >
                              Reject
                            </button>
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

export default NFToffer;
