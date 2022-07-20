import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {getOrderByNftID} from "../../helpers/getterFunctions";
import {useCookies} from "react-cookie";
import NotificationManager from "react-notifications/lib/NotificationManager";
import {convertToEth} from "../../helpers/numberFormatter";
import moment from "moment";
import {
  createBid,
  handleBuyNft,
  handleRemoveFromSale,
} from "../../helpers/sendFunctions";
import PopupModal from "../components/AccountModal/popupModal";
import Logo from "../../assets/images/logo.svg";
import Clock from "./Clock";
import { GENERAL_TIMESTAMP} from "../../helpers/constants";
import {Tokens} from "../../helpers/tokensToSymbol";
import {ethers} from "ethers";
import Spinner from "./Spinner";
import {slowRefresh} from "../../helpers/NotifyStatus";
import {fetchBidNft} from "../../apiServices";

function NFTlisting(props) {
  const [orders,setOrders]=useState([]);
  const [currentUser,setCurrentUser]=useState("");
  const [cookies]=useCookies([]);
  const [qty,setQty]=useState(1);
  const [price,setPrice]=useState(0);
  const [willPay,setWillPay]=useState(0);
  const [isBuyNowModal,setIsBuyNowModal]=useState(false);
  const [isPlaceBidModal,setIsPlaceBidModal]=useState(false);
  const [currentOrder,setCurrentOrder]=useState([]);
  const [loading,setLoading]=useState(false);
  const [haveBid,setHaveBid]=useState(false);

  useEffect(() => {
    if(cookies.selected_account) {
      setCurrentUser(cookies.selected_account);
      // setUserBalance(cookies.balance);
    }
  },[cookies.selected_account]);

  useEffect(() => {
    const fetch=async () => {
      if(props.id) {
        const _orders=await getOrderByNftID({nftID: props.id});
        setOrders(_orders?.results);
      }
    };
    fetch();
  },[props.id]);

  useEffect(() => {
    const fetch=async () => {
      let searchParams={
        nftID: props.id,
        buyerID: localStorage.getItem("userId"),
        bidStatus: "All",
        orderID: "All",
      };

      let _data=await fetchBidNft(searchParams);
      console.log("bid data123",_data);
      if(_data&&_data.data.length>0) {
        setHaveBid(true);
      }
    };
    fetch();
  },[props.id]);

  useEffect(() => {
    var body=document.body;
    if(loading||isPlaceBidModal||isBuyNowModal) {
      body.classList.add("overflow_hidden");
    } else {
      body.classList.remove("overflow_hidden");
    }
  },[loading,isPlaceBidModal,isBuyNowModal]);

  // Place Bid Checkout Modal

  const placeBidModal=(
    <PopupModal
      content={
        <div className='popup-content1'>
          <h3 className='modal_heading '>Complete Checkout</h3>
          <div className='bid_user_details my-4'>
            <img src={Logo} alt='' />
            <div className='bid_user_address'>
              <div>
                <span className='adr'>
                  {currentUser?.slice(0,8)+
                    "..."+
                    currentUser?.slice(34,42)}
                </span>
                <span className='badge badge-success'>Connected</span>
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
            disabled={props? props.NftDetails.type===1:false}
            value={qty}
            onKeyPress={(e) => {
              if(!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if(Number(e.target.value)>Number(100)) {
                NotificationManager.error(
                  "Quantity should be less than seller's order",
                  "",
                  800
                );
                return;
              }
              setQty(e.target.value);
              setWillPay((e.target.value*price).toFixed(4));
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
              if(!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              const re=/[+-]?[0-9]+\.?[0-9]*/;
              let val=e.target.value;
              if(e.target.value===""||re.test(e.target.value)) {
                const numStr=String(val);
                if(numStr.includes(".")) {
                  if(numStr.split(".")[1].length>8) {
                  } else {
                    if(val.split(".").length>2) {
                      val=val.replace(/\.+$/,"");
                    }
                  
                  }
                } else {
                  if(val.split(".").length>2) {
                    val=val.replace(/\.+$/,"");
                  }
                
                }
                setPrice(val);
              }
            }}></input>
          <button
            className='btn-main mt-2 btn-placeABid'
            onClick={async () => {
              // console.log(
              //   " ethers.utils.parseEther(price)",
              //   ethers.utils.parseEther(price.toString())
              // );
              setIsPlaceBidModal(false);
              setLoading(true);
              if(
                Number(price)<
                Number(convertToEth(currentOrder.price?.$numberDecimal))
              ) {
                NotificationManager.error(
                  "Bid Price must be greater than minimum bid",
                  "",
                  800
                );
                setIsPlaceBidModal(true);
                setLoading(false);
                return;
              }
              try {
                await createBid(
                  currentOrder.nftID,
                  currentOrder._id,
                  currentOrder.sellerID?._id,
                  currentUser,
                  props?.NftDetails?.type,
                  currentOrder.total_quantity,
                  ethers.utils.parseEther(price.toString()),
                  false
                  // new Date(bidDeadline).valueOf() / 1000
                );
                NotificationManager.success("Bid Placed Successfully","",800);
                setLoading(false);
                slowRefresh(1000);
              } catch(e) {
                NotificationManager.error("Something went wrong","",800);
              }
            }}>
            {"Place Bid"}
          </button>
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

  const buyNowModal=(
    <PopupModal
      content={
        <div className='popup-content1'>
          <h3 className='modal_heading '>Complete Checkout</h3>
          <div className='bid_user_details my-4'>
            <img src={Logo} alt='' />
            <div className='bid_user_address'>
              <div>
                <span className='adr'>
                  {currentUser?.slice(0,8)+
                    "..."+
                    currentUser?.slice(34,42)}
                </span>
                <span className='badge badge-success'>Connected</span>
              </div>
              <span className='pgn'>Polygon</span>
            </div>
          </div>
          <h6 className='enter_quantity_heading required'>
            Please Enter the Quantity
          </h6>
          <input
            className='form-control checkout_input'
            type='text'
            min='1'
            step='1'
            placeholder='Quantity e.g. 1,2,3...'
            disabled={props? props.NftDetails.type===1:false}
            value={qty}
            onKeyPress={(e) => {
              if(!/^\d*$/.test(e.key)) e.preventDefault();
            }}
            onChange={(e) => {
              if(
                Number(e.target.value)>Number(currentOrder.total_quantity)
              ) {
                NotificationManager.error(
                  "Quantity should be less than seller's order",
                  "",
                  800
                );
                return;
              }
              setQty(e.target.value);
              setWillPay((e.target.value*price).toFixed(4));
            }}></input>
          <h6 className='enter_price_heading required'>Price</h6>
          <input
            className='form-control checkout_input'
            type='text'
            min='1'
            placeholder='Price e.g. 0.001,1...'
            disabled={true}
            value={price}></input>
          <button
            className='btn-main mt-2 btn-placeABid'
            onClick={async () => {
              setIsBuyNowModal(false);
              setLoading(true);
              const hbn=await handleBuyNft(
                currentOrder._id,
                props?.NftDetails?.type===1,
                currentUser,
                cookies.balance,
                currentOrder.total_quantity,
                false,
                props?.NftDetails?.collectionAddress?.toLowerCase()
              );
              // setLoading(false);
            }}>
            {"Buy Now"}
          </button>
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
    <div className='row'>
      {loading? <Spinner />:""}
      {isPlaceBidModal? placeBidModal:""}
      {isBuyNowModal? buyNowModal:""}

      {orders && orders.length <= 0 ?
       <div className="col-md-12">
       <h4 className="no_data_text text-muted">No Listings Available</h4>
     </div> :
     <div className='table-responsive'>
     <div className='col-md-12'>
       <div className='nft_list'>
         <table className='table text-light'>
           <thead>
             <tr>
               <th scope='col'>FROM</th>
               <th scope='col'>PRICE</th>
               <th scope='col'>DATE</th>
               <th scope='col'>SALE TYPE</th>
               <th scope='col'>ENDS IN</th>
               <th scope='col'>STATUS</th>
               <th className='text-center'>ACTION</th>
             </tr>
           </thead>
           <tbody>
             {orders&&orders.length>0
               ? orders.map((o,i) => {
                 return (
                   <tr>
                     <td className='d-flex justify-content-start align-items-center mb-0'>
                       <span className='yellow_dot circle_dot'></span>
                       <span>
                         {o.sellerID&&o.sellerID.walletAddress
                           ? o.sellerID.walletAddress.slice(0,3)+
                           "..."+
                           o.sellerID.walletAddress.slice(39,42)
                           :""}
                       </span>
                     </td>
                     <td>
                       <img
                         alt=''
                         src={Tokens[o.paymentToken.toLowerCase()].icon}
                         className='img-fluid hunter_fav'
                       />{" "}
                       {o.price&&o.price.$numberDecimal
                         ? Number(
                           convertToEth(o.price.$numberDecimal)
                         ).toFixed(4)
                         :"0"}{" "}
                       {Tokens[o.paymentToken.toLowerCase()].symbolName}
                     </td>
                     <td>
                       {moment(o.createdOn).format("DD/MM/YYYY")}{" "}
                       <span className='nft_time'>
                         {moment(o.createdOn).format("LT")}
                       </span>
                     </td>
                     <td>
                       {o.salesType===0
                         ? "Fixed Sale"
                         :o.salesType===1 && o.deadline !== GENERAL_TIMESTAMP
                           ? "Auction"
                           :"Open for Bids"}
                     </td>
                     <td>
                    
                       {moment(new Date(o.deadline*1000))
                         .subtract({
                           hours: 5,
                           minutes: 30,
                         })._d<new Date() || o.deadline === GENERAL_TIMESTAMP ? (
                         "--:--:--"
                       ):(
                         <Clock
                           deadline={moment(new Date(o.deadline*1000))
                             .subtract({
                               hours: 5,
                               minutes: 30,
                             })
                             .toISOString()}></Clock>
                       )}
                     </td>
                     <td className='blue_text'>
                       {moment(new Date(o.deadline*1000))
                         .subtract({
                           hours: 5,
                           minutes: 30,
                         })._d>new Date()
                         ? "Active"
                         :"Ended"}
                     </td>
                     <td>
                       <div className='text-center'>
                         {o.sellerID?.walletAddress?.toLowerCase()===
                           currentUser?.toLowerCase()? (
                           <button
                             to={"/"}
                             className='small_yellow_btn small_btn mr-3'
                             onClick={async () => {
                               setLoading(true);
                               await handleRemoveFromSale(
                                 o._id,
                                 currentUser
                               );
                               setLoading(false);
                             }}>
                             Remove From Sale
                           </button>
                         ):(
                           <button
                             to={"/"}
                             disabled={
                               moment(new Date(o.deadline*1000))
                                 .subtract({
                                   hours: 5,
                                   minutes: 30,
                                 })._d<new Date()? true:false
                             }
                             className='small_border_btn small_btn'
                             onClick={async () => {
                               console.log("current order",o);
                               if(
                                 moment(new Date(o.deadline*1000))
                                   .subtract({
                                     hours: 5,
                                     minutes: 30,
                                   })._d<new Date()
                               ) {
                                 NotificationManager.error(
                                   "Auction Ended",
                                   "",
                                   800
                                 );
                                 return;
                               }
                               if(currentUser) {
                                 o.salesType===0
                                   ? setPrice(
                                     Number(
                                       convertToEth(o.price.$numberDecimal)
                                     ).toFixed(4)
                                   )
                                   :setPrice("");
                                 props.NftDetails.type===1&&
                                   setCurrentOrder(o);
                                 o.salesType===0
                                   ? setIsBuyNowModal(true)
                                   :setIsPlaceBidModal(true);
                               } else {
                                 NotificationManager.error(
                                   "wallet not connected",
                                   "",
                                   800
                                 );
                                 return;
                               }
                             }}>
                             {o.salesType===0
                               ? "Buy Now"
                               :haveBid
                                 ? "Update Bid"
                                 :"Place Bid"}
                           </button>
                         )}
                       </div>
                     </td>
                   </tr>
                 );
               })
               :""}
           </tbody>
         </table>
       </div>
     </div>
     </div>
    }
     
    </div>
  );
}

export default NFTlisting;
