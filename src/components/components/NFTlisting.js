import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrderByNftID } from "../../helpers/getterFunctions";
import { useCookies } from "react-cookie";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import {
  handleBuyNft,
  handleRemoveFromSale,
} from "../../helpers/sendFunctions";

function NFTlisting(props) {
  const [orders, setOrders] = useState([]);

  const [currentUser, setCurrentUser] = useState();
  const [cookies] = useCookies([]);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Wallet", "", 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {orders && orders.length > 0
                ? orders.map((o, i) => {
                    return (
                      <tr>
                        <td>
                          <span className="yellow_dot circle_dot"></span>
                          {o.sellerID && o.sellerID.walletAddress
                            ? o.sellerID.walletAddress.slice(0, 3) +
                              "..." +
                              o.sellerID.walletAddress.slice(39, 41)
                            : ""}
                        </td>
                        <td>
                          <img
                            alt=""
                            src={"../img/favicon.png"}
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
                        <td className="blue_text">Active</td>
                        <td>
                          <div className="text-center">
                            {o.sellerID?.walletAddress.toLowerCase() ===
                            currentUser.toLowerCase() ? (
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
                                className="small_border_btn small_btn"
                                onClick={() => {
                                  handleBuyNft(
                                    o._id,
                                    props.NftDetails.type == 1,
                                    currentUser,
                                    "1000000000000",
                                    1,
                                    false,
                                    props.NftDetails.collectionAddress
                                  );
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
