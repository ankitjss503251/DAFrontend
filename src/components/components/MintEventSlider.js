import React, { useEffect, useState } from "react";
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Wallet from "../SVG/wallet";
import { getNFTList, GetOrdersByNftId } from "../../apiServices";
import { handleBuyNft } from "../../helpers/sendFunctions";
import { useCookies } from "react-cookie";
import NotificationManager from "react-notifications/lib/NotificationManager";
import Loader from "./../components/loader";

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

  const [nfts, setNfts] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [currQty, setCurrQty] = useState(1);
  const [loading, setLoading] = useState(false);

  let mint = [];

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Wallet", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("current user is---->", currentUser, cookies.selected_account);
  }, []);

  useEffect(() => {
    console.log("props.id", props.id);
    const fetch = async () => {
      let reqBody = {
        page: 1,
        limit: 100,
        collectionID: props.id,
        isLazyMinted: true,
      };
      let nfts = await getNFTList(reqBody);
      if (nfts && nfts.results && nfts.results.length > 0) {
        for (let i = 0; i < nfts.results.length; i++) {
          mint[i] = 0;
        }
        setNfts(nfts.results[0]);
      }
    };
    fetch();
  }, [props.id]);

  const handleMint = async (i) => {
    setLoading(true);
    console.log("curr user", currentUser);
    let id, isERC721, account, balance, qty;
    id = nfts[i]._id;
    isERC721 = nfts[i].type == 1;
    account = currentUser;
    balance = 10000;
    qty = currQty;
    try {
      let orders = await GetOrdersByNftId({ nftId: id });
      console.log("orders", orders);
      console.log(
        "id, isERC721, account, balance, qty",
        orders.results[0]._id,
        isERC721,
        account,
        balance,
        qty
      );
      let res = await handleBuyNft(
        orders?.results[0]?._id,
        isERC721,
        account,
        balance,
        qty,
        1,
        props.id
      );
      if (res == false) {
        setLoading(false);
        return;
      }
    } catch (e) {
      console.log("err", e);
      NotificationManager.error("Something went wrong");
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <Slider {...settings}>
      {nfts && nfts.length > 0
        ? nfts.map((n, i) => {
            return (
              <div className='mintevent text-center'>
                <div className='start_btn'>
                  Start
                  <span>Live</span>
                </div>
                <h4>Mint Event</h4>
                <p>
                  {n.quantity_minted} / {n.totalQuantity} Minted
                </p>
                <div className='da_img mb-3'>
                  <img src={"../img/mint/da.png"} alt='' />
                </div>
                <Link to={"#"} className='connect_wallet_btn mb-4'>
                  {" "}
                  <Wallet /> Connect Wallet
                </Link>
                <div className='mintprice'>Mint Price {props.price} HNTR</div>
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
                        if (mint > n.totalQuantity - n.quantity_minted)
                          mint = n.totalQuantity - n.quantity_minted;
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
                        console.log("index", i);
                        await handleMint(i);
                      }}>
                      Mint
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        : ""}
    </Slider>
  );
}

export default MintEventSlider;
