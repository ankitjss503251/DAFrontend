import React, { useEffect, useState } from "react";
import BellSVG from "../SVG/BellSVG";
import ListSVG from "../SVG/ListSVG";
import CartSVG from "../SVG/CartSVG";
import TransferSVG from "../SVG/TransferSVG";
import CancelledSVG from "../SVG/CancelledSVG";
import { fetchHistory } from "../../helpers/getterFunctions";
import { Tokens } from "../../helpers/tokensToSymbol";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";

const NFThistory = (props) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async (nftID, userID) => {
      try {
        const data = {
          page: 1,
          limit: 12,
          nftID: nftID,
          userID: userID
        };
        const hist = await fetchHistory(data);
        setHistory(hist);
      } catch (e) {
        console.log("Error in fetching history", e);
      }
    };
    if (props) fetch(props.nftID, props.userID);
  }, [props.nftID, props.userID, props.reloadContent]);

  return (
    <div className='row'>

      {history?.length > 0 ?
        <div className="table-responsive">
          <div className='col-md-12'>
            <div className='nft_list'>
              <table className='table text-light'>
                <thead>
                  <tr>
                    <th>EVENT</th>
                    <th>TYPE</th>
                    <th>PRICE</th>
                    <th>FROM</th>
                    <th>TO</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    history && history.length > 0 ? history?.map((h, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            {
                              (h?.action === "PutOnSale") ? <>
                                <span className='nft_svg'>
                                  <ListSVG />
                                </span>
                                List
                              </> : (h?.action === "RemoveFromSale") ? <>
                                <span className='nft_svg'>
                                  <CancelledSVG />
                                </span>
                                List Cancelled
                              </> : (h?.action === "Sold") ? <>
                                <span className='nft_svg'>
                                  <CartSVG />
                                </span>
                                Sold
                              </> : (h?.action === "Offer") ? <>
                                <span className='nft_svg'>
                                  <BellSVG />
                                </span>
                                Offer
                              </> : <>
                                <span className='nft_svg'>
                                  <BellSVG />
                                </span>
                                Bid
                              </>
                            }

                          </td>
                          <td>
                            {h?.type}
                          </td>
                          <td>
                            <img
                              alt=''
                              src={h?.paymentToken ? Tokens[h?.paymentToken?.toLowerCase()]?.icon : ""}
                              className='img-fluid hunter_fav'
                            />{" "}
                            {Number(convertToEth(h?.price))
                              ?.toFixed(6)
                              ?.slice(0, -2)}
                          </td>
                          <td>
                            <span className={`${h?.action === "putOnSale" ? "yellow_dot" : h?.action === "RemoveFromSale" ? "blue_dot" : h?.action === "Offer" ? "lightblue_dot" : "yellow_dot"} circle_dot`}></span>
                            {(h?.action === "PutOnSale" || h?.action === "RemoveFromSale") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                              (h?.action === "Bid") ? ((h?.type === "Created" || h?.type === "Updated") ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) :
                                (h?.type === "Accepted") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                                  (h?.type === "Rejected") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                                    (h?.type === "Cancelled") ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) : "0x0"
                              ) :
                                (h?.action === "Sold") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                                  (h?.action === "Offer") ? (h?.type === "Created" || h?.type === "Updated") ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) :
                                    (h?.type === "Accepted") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                                      (h?.type === "Rejected") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                                        h?.type === "Cancelled" ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) :
                                          "0x0" : "0x0"}
                          </td>
                          <td>
                            <span className={`${h?.action === "putOnSale" ? "yellow_dot" : h?.action === "RemoveFromSale" ? "blue_dot" : h?.action === "Offer" ? "lightblue_dot" : "yellow_dot"} circle_dot`}></span>
                            {h?.action === "PutOnSale" || h?.action === "RemoveFromSale" ? "0x0" :
                              h?.action === "Bid" ? ((h?.type === "Created" || h?.type === "Updated") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
                                (h?.type === "Accepted") ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) :
                                  (h?.type === "Rejected") ? "0x0" :
                                    (h?.type === "Cancelled") ? "0x0" : "0x0"
                              ) :
                                h?.action === "Sold" ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) :
                                  (h?.action === "Offer") ? (h?.type === "Created" || h?.type === "Updated") ? "0x0" :
                                    (h?.type === "Accepted") ? (h?.buyerAddress?.slice(0, 4) + "..." + h?.buyerAddress?.slice(38, 42)) :
                                      (h?.type === "Rejected") ? "0x0" :
                                        h?.type === "Cancelled" ? "0x0" :
                                          "0x0" : "0x0"}
                          </td>
                          <td>{moment.utc(h?.createdOn).local().format("DD/MM/YYYY")}  <span className="nft_time">{moment.utc(h?.createdOn).local().format("hh:mm")}</span></td>
                        </tr>
                      )
                    }) : ""
                  }
                  {/* <tr>
                <td>
                  <span className='nft_svg'>
                    <BellSVG />
                  </span>
                  Offer
                </td>
                <td>
                  <img
                    alt=''
                    src={"../img/favicon.png"}
                    className='img-fluid hunter_fav'
                  />{" "}
                  5.02
                </td>
                <td>
                  <span className='yellow_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  <span className='yellow_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  15/03/2022 <span className='nft_time'>23:13</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className='nft_svg'>
                    <ListSVG />
                  </span>
                  List
                </td>
                <td>
                  <img
                    alt=''
                    src={"../img/favicon.png"}
                    className='img-fluid hunter_fav'
                  />{" "}
                  5.02
                </td>
                <td>
                  <span className='yellow_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  <span className='yellow_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  15/03/2022 <span className='nft_time'>23:13</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className='nft_svg'>
                    <CartSVG />
                  </span>
                  Sold
                </td>
                <td>
                  <img
                    alt=''
                    src={"../img/favicon.png"}
                    className='img-fluid hunter_fav'
                  />{" "}
                  5.02
                </td>
                <td>
                  <span className='lightblue_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  <span className='lightblue_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  15/03/2022 <span className='nft_time'>23:13</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className='nft_svg'>
                    <TransferSVG />
                  </span>
                  Transfer
                </td>
                <td>
                  <img
                    alt=''
                    src={"../img/favicon.png"}
                    className='img-fluid hunter_fav'
                  />{" "}
                  5.02
                </td>
                <td>
                  <span className='blue_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  <span className='blue_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  15/03/2022 <span className='nft_time'>23:13</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className='nft_svg'>
                    <CancelledSVG />
                  </span>
                  List Cancelled
                </td>
                <td>
                  <img
                    alt=''
                    src={"../img/favicon.png"}
                    className='img-fluid hunter_fav'
                  />{" "}
                  5.02
                </td>
                <td>
                  <span className='yellow_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  <span className='yellow_dot circle_dot'></span>0xc8b...6d74
                </td>
                <td>
                  15/03/2022 <span className='nft_time'>23:13</span>
                </td>
              </tr> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        : (
          <div className="col-md-12">
            <h4 className="no_data_text text-muted">No History Available</h4>
          </div>
        )}

    </div>
  );
};

export default NFThistory;
