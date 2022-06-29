import React, { useEffect, useState } from "react";
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Wallet from "../SVG/wallet";
import { convertToEth } from "../../helpers/numberFormatter";

import {  fetchInfo,
         testMintGachyi,
         mintTokensGachyi } from "../../helpers/gachyiCalls"
import BigNumber from "bignumber.js";
import { useCookies } from "react-cookie";
export const msgTrigger = async (str) => {
console.log(str);
};

function MintEventSlider(props) {
 
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



  useEffect(() => {
    const getPrice = async () => {
      let getcateg = await fetchInfo(0);
      setPrice( convertToEth(new BigNumber(getcateg.price.toString())));
    }
    getPrice();
  }, []);
  const mintFunction = async (id,qty,price,user) => {
     let result = await testMintGachyi(id,qty,user,price)
     if(result){
      console.log("in  mint section");
      let txn = await mintTokensGachyi(id,qty,user,price)
      console.log(txn);
      
     }
      
  }

  return (
    <Slider {...settings}>

      <div className='mintevent text-center'>
        <div className='start_btn'>
          Start
          <span>Live</span>
        </div>
        <h4>Mint Event</h4>
        <p>
          {/* {n.quantity_minted} / {n.totalQuantity} Minted */}
        </p>
        <div className='da_img mb-3'>
          <img src={"../img/mint/da.png"} alt='' />
        </div>
        <Link to={"#"} className='connect_wallet_btn mb-4'>
          {" "}
          <Wallet /> Connect Wallet
        </Link>
        <div className='mintprice'>Mint Price {price} HNTR</div>
        <div className='amount'>
          <h5>Select Amount</h5>
          <p>Minimum for mint is 1*</p>
          <div className='qt_selector'>
            <button
              onClick={() => {
                let mint = currQty - 1;
                if (mint < 1) mint = 1;
                setCurrQty(Number(mint));
              }}>
              -
            </button>

            <input
              type='text'
              name=''
              required=''
              id=''
              onChange={(e) => {
                setCurrQty(Number(e.target.value));
              }}
              value={currQty}
            />

            <button
              onClick={() => {
                let mint = currQty + 1;
                // if (mint > n.totalQuantity - n.quantity_minted)
                //   mint = n.totalQuantity - n.quantity_minted;
                setCurrQty(Number(mint));
              }}>
              +
            </button>
          </div>
          <div className='mint_btn mt-4'>
            <button
              className=''
              type='button'
              onClick={async (e) => {
                // console.log("index", i);
                await mintFunction(0,currQty,price,cookies.selected_account);
              }}
            // disabled={!isMintEnabled}
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
