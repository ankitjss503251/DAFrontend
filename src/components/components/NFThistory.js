import React, { useEffect, useState } from "react";
import BellSVG from "../SVG/BellSVG";
import ListSVG from "../SVG/ListSVG";
import CartSVG from "../SVG/CartSVG";
import TransferSVG from "../SVG/TransferSVG";
import CancelledSVG from "../SVG/CancelledSVG";
import { fetchHistory } from "../../helpers/getterFunctions";
import { Tokens } from "../../helpers/tokensToSymbol";
import { convertToEth } from "../../helpers/numberFormatter";

const NFThistory = (props) => {
 const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetch = async (nftID) => {
      try {
        const data = {
          page: 1,
          limit: 12,
          nftID: nftID,
        };
        const hist = await fetchHistory(data);
        setHistory(hist);
      } catch (e) {
        console.log("Error in fetching history", e);
      }
    };
    if (props.nftID) fetch(props.nftID);
  }, [props.nftID]);

  return (
    <div className='row'>
      <div className='col-md-12'>
        <div className='nft_list'>
          <table className='table text-light'>
            <thead>
              <tr>
                <th>EVENT</th>
                <th>PRICE</th>
                <th>FROM</th>
                <th>TO</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {
                history && history.length > 0 ? history?.map((h,i) => {
                  return (
                    <tr>
                    <td>
                      {
                       ( h?.action === "PutOnSale") ? <>
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
                      <img
                        alt=''
                        src={h?.paymentToken ? Tokens[h?.paymentToken?.toLowerCase()]?.icon : ""}
                        className='img-fluid hunter_fav'
                      />{" "}
                  {Number(convertToEth(h?.price))
                  .toFixed(6)
                  .slice(0, -2)}
                    </td>
                    <td>
                      <span className={`${h?.action === "putOnSale" ? "yellow_dot": h?.action === "RemoveFromSale" ? "blue_dot" : h?.action === "Offer" ? "lightblue_dot" : "yellow_dot"} circle_dot`}></span>{h?.from ? h?.from?.slice(0,4) + "..." + h?.from?.slice(38,42) : "-"}
                    </td>
                    <td>
                      <span className={`${h?.action === "putOnSale" ? "yellow_dot": h?.action === "RemoveFromSale" ? "blue_dot" : h?.action === "Offer" ? "lightblue_dot" : "yellow_dot"} circle_dot`}></span>{h?.to ? h?.to?.slice(0,4) + "..." + h?.to?.slice(38,42) : "-"}
                    </td>
                    <td>
                      15/03/2022 <span className='nft_time'>23:13</span>
                    </td>
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
  );
};

export default NFThistory;
