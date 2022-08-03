import React, { useEffect, useState } from "react";
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Wallet from "../SVG/wallet";
import { convertToEth } from "../../helpers/numberFormatter";
import "../components-css/App.css";
import evt from "../../events/events";
import { onboard } from "../menu/header";
import BigNumber from "bignumber.js";
import { useCookies } from "react-cookie";
import DevTeam from "./../../assets/images/devTeam.png";
import {MAX_WHITELIST_BUY_PER_USER} from "../../helpers/constants"
import Spinner from "../components/Spinner"

evt.setMaxListeners(1);
function MintEventSlider(props) {
  let contract = props.calls;
  var settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    arrows: true,
    dots: false,
    speed: 300,
    centerPadding: "0px",
    infinite: false,
    // autoplaySpeed: 5000,
    // autoplay: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [currQty, setCurrQty] = useState(1);
  const [price, setPrice] = useState();
  const [loading, setLoading] = useState(false);
  const [maxNFT,setMaxNFT] =useState(5);

  useEffect(() => {
  
    const bodyClass = async () => {
      var body = document.body;
      if (loading) {
        body.classList.add("overflow_hidden");
      } else {
        body.classList.remove("overflow_hidden");
      }
    };
    bodyClass();
  }, [loading]);
  const fetchData = async () => {
    // setLoading(true)
    let { fetchInfo,
      fetchUserBal} = await contract;
    let getcateg = await fetchInfo(props.id);
    console.log(props.id);
    if(cookies.selected_account){
      let bal=await fetchUserBal(cookies.selected_account,props.id)
      
      if(MAX_WHITELIST_BUY_PER_USER>parseInt(bal)){
          setMaxNFT(MAX_WHITELIST_BUY_PER_USER-parseInt(bal));
          console.log("max NFT set To:",maxNFT);
        }
        else{
          setMaxNFT(1);
          
        }
      
    }
    
    setPrice(convertToEth(new BigNumber(getcateg[0].toString())));
    //  setLoading(false)
  };

  useEffect(() => {
    fetchData();
  }, []);
  const connectWalletEvent = () => {
    evt.emit("wallet-connect");
  };
  const mintFunction = async (qty, price, user) => {
    let { testMint } = await contract;
    let result = await testMint(props.id, qty, price, user);
    
  };
 
  return (
    <Slider {...settings}>
      
      <div className="mintevent text-center">
      {/* {loading ? <Spinner /> : ""} */}
     
        <div className="start_btn stamintFunctionbtn">
          Start
          <span>Live</span>
        </div>
        <h4>Mint Event</h4>
        <p>{/* {n.quantity_minted} / {n.totalQuantity} Minted */}</p>
        <div className="da_img mb-3">
          <img src={DevTeam} alt="" />
        </div>
        {!cookies.selected_account ? (
          <button
            className="connect_wallet_btn mb-4"
            onClick={() => {
              connectWalletEvent();
            }}
          >
            {" "}
            <Wallet /> Connect Wallet
          </button>
        ) : (
          ""
        )}
        <div className="mintprice">Mint Price {price} HNTR</div>
        <div className="amount">
          <h5>Select Amount</h5>
          <p>Minimum for mint is 1*</p>
          <div className="qt_selector">
            <button
              onClick={() => {
                let mint = currQty - 1;
                if (mint < 1) mint = 1;
                if (mint > maxNFT) mint = maxNFT;
                if (1 > maxNFT) mint = 1;
                setCurrQty(Number(mint));
              }}
            >
              -
            </button>

            <input
              type="text"
              name=""
              required=""
              id=""
              onChange={(e) => {
                setCurrQty(Number(e.target.value));
              }}
              value={currQty}
            />

            <button
              onClick={() => {
                let mint = currQty + 1;
                if (mint < 1) mint = 1;
                if (mint > maxNFT) mint = maxNFT;
                if (1 > maxNFT) mint = 1;
                // if (mint > n.totalQuantity - n.quantity_minted)
                //   mint = n.totalQuantity - n.quantity_minted;
                setCurrQty(Number(mint));
              }}
            >
              +
            </button>
          </div>
          <div className="mint_btn mt-4">
            <button
              className=""
              type="button"
              onClick={async (e) => {
                // console.log("index", i);
                await mintFunction(currQty, price, cookies.selected_account);
              }}
              disabled={!cookies.selected_account}
            >
              Mint
            </button>
          </div>
        </div>
      </div>
    </Slider>
  );
}

export default MintEventSlider;
