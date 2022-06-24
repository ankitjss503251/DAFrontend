import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/footer";
import CollectionList from "../components/CollectionList";
import ItemSVG from "../SVG/ItemSVG";
import ActivitySVG from "../SVG/ActivitySVG";
import { Link, NavLink } from "react-router-dom";
import { CollectionCard } from "../../Data/dummyJSON";
import UpArrow from "../SVG/dropdown";
import { useCookies } from "react-cookie";
import { NotificationManager } from "react-notifications";
import Threegrid from "../SVG/Threegrid";
import Twogrid from "../SVG/Twogrid";
import AllNFTs from "../SVG/AllNFTs";
import Firearmsvg from "../SVG/Firearmsvg";
import Soldierssvg from "../SVG/Soldierssvg";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCollections,
  getNFTs,
  getCategory,
} from "../../helpers/getterFunctions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import arrow from "./../../assets/images/ep_arrow-right-bold.png";
import BGImg from "../../assets/images/background.jpg"


const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function Collection() {
  var bgImgarrow = {
    backgroundImage: `url(${arrow})`,
    backgroundRepeat: "no-repeat",
  };

  const bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  const gridtwo = () => {
    setgrid("col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-4");
    document.getElementById("gridtwo").classList.add("active");
    document.getElementById("gridthree").classList.remove("active");
  };
  const gridthree = () => {
    setgrid("col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4");
    document.getElementById("gridthree").classList.add("active");
    document.getElementById("gridtwo").classList.remove("active");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [grid, setgrid] = useState("col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4");

  const [currentUser, setCurrentUser] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [collectionDetails, setCollectionDetails] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [nftList, setNftList] = useState([]);
  const [category, setCategory] = useState([]);
  const { id } = useParams();

  useEffect(async () => {
    try {
      const c = await getCategory();
      setCategory(c);
    } catch (e) {
      console.log("Error", e);
    }
  }, []);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    // else NotificationManager.error("Connect Yout Wallet", "", 800);
    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [currentUser]);

  const [togglemode, setTogglemode] = useState("filterhide");
  const [currPage, setCurrPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const { searchedText } = useParams();

  const filterToggle = () => {
    console.log("filter", togglemode);
    if (togglemode === "filterhide") {
      setTogglemode("filtershow");
      document.getElementsByClassName("filter_btn")[0].classList.add("active");
    } else {
      setTogglemode("filterhide");
      document
        .getElementsByClassName("filter_btn")[0]
        .classList.remove("active");
    }
  };

  useEffect(async () => {
    try {
      const c = await getCategory();
      setCategory(c);
    } catch (e) {
      console.log("Error", e);
    }
  }, []);

  useEffect(async () => {
    let temp = nftList;
    try {
      const reqData = {
        page: 1,
        limit: 1,
        collectionID: id,
        searchText: searchedText ? searchedText : "",
      };
      const res = await getCollections(reqData);
      console.log("collll", res[0]);
      setCollectionDetails(res[0]);
      const data = {
        page: currPage,
        limit: 12,
        collectionID: id,
      };
      const nfts = await getNFTs(data);
      if (nfts.length > 0) {
        setLoadMoreDisabled("");
        temp = [...temp, nfts];
        setCurrPage(currPage + 1);
        setNftList(temp[0]);
        for(let i = 0; i < temp[0].length; i++){
          temp[0][i] = {
            ...temp[0][i],
            price: res[0]?.price
          }
        }
      }
      if (!nftList && nfts.length <= 0) {
        setLoadMoreDisabled("disabled");
      }
    } catch (e) {
      console.log("Error in fetching all collections list", e);
    }
  }, [loadMore]);



  return (
    <div style={bgImgStyle}>
       {loadMoreDisabled
        ? NotificationManager.info("No more items to load")
        : ""}
      <section
        className='collection_banner pdd_8'
        style={{
          backgroundImage: `url(${collectionDetails?.coverImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}></section>
      <section className='collection_info'>
        <div className='container'>
          <div className='collection_pick'>
            <img
              alt=''
              src={collectionDetails?.logoImg}
              class='img-fluid collection_profile'
            />
            <img
              alt=''
              src={"../img/collections/check.png"}
              class='img-fluid check_img'
            />
          </div>
          <h1 className='collection_title text-center'>
            {collectionDetails?.name}
          </h1>
          <ul class='collection_social mb-4'>
            <li>
              <Link to={"/"}>
                <i class='fa fa-facebook fa-lg'></i>
              </Link>
            </li>
            <li>
              <Link to={"/"}>
                <i class='fa fa-twitter fa-lg'></i>
              </Link>
            </li>
            <li>
              <Link to={"/"}>
                <i class='fa fa-linkedin fa-lg'></i>
              </Link>
            </li>
            <li>
              <Link to={"/"}>
                <i class='fa fa-pinterest fa-lg'></i>
              </Link>
            </li>
          </ul>

          <div className='coppycode text-center'>
            <span className='ctc'>
              <img alt='' src={"../img/favicon.png"} class='img-fluid' />
              <div className=''>
                {collectionDetails?.contractAddress?.slice(0, 4) +
                  "..." +
                  collectionDetails?.contractAddress?.slice(38, 42)}
              </div>

              <CopyToClipboard
                text={collectionDetails?.contractAddress}
                onCopy={() => {
                  console.log("copied!!!");
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 3000);
                }}>
                <svg
                  width='21'
                  height='24'
                  viewBox='0 0 21 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M15 21V22.875C15 23.4963 14.4963 24 13.875 24H1.125C0.503672 24 0 23.4963 0 22.875V5.625C0 5.00367 0.503672 4.5 1.125 4.5H4.5V18.375C4.5 19.8225 5.67755 21 7.125 21H15ZM15 4.875V0H7.125C6.50367 0 6 0.503672 6 1.125V18.375C6 18.9963 6.50367 19.5 7.125 19.5H19.875C20.4963 19.5 21 18.9963 21 18.375V6H16.125C15.5063 6 15 5.49375 15 4.875ZM20.6705 3.42052L17.5795 0.329484C17.3685 0.11852 17.0824 1.55998e-06 16.784 0L16.5 0V4.5H21V4.21598C21 3.91763 20.8815 3.63149 20.6705 3.42052Z'
                    fill='#fff'
                  />
                </svg>
              </CopyToClipboard>
              {isCopied ? <p className='copied'>Copied!</p> : ""}
            </span>
          </div>
          <ul className='collection_status mt-5 mb-5'>
            <li>
              <h4>10.0k</h4>
              <p>items</p>
            </li>
            <li>
              <h4>1.2k</h4>
              <p>owners</p>
            </li>
            <li>
              <h4>498</h4>
              <p>floor price</p>
            </li>
            <li>
              <h4>1.3M</h4>
              <p>volume traded</p>
            </li>
          </ul>
          <div className='collection_description text-center'>
            <p>{collectionDetails?.desc}</p>
            <span className='top_arrow'>
              <img alt='' src={"../img/top_arrow.png"} class='img-fluid' />
            </span>
          </div>

          <div className='row mb-5'>
            <div className='col-md-12 text-center item_active'>
              <NavLink activeclassname='active-link' to={-1} className='mr-3'>
                <span className='mr-3'>
                  <ItemSVG />
                </span>{" "}
                Items
              </NavLink>
              <NavLink to={"/collectionActivity"}>
                <span className='mr-3'>
                  <ActivitySVG />
                </span>{" "}
                Activity
              </NavLink>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <div className='market_search_form mb-4'>
                <form class='d-flex marketplace_form'>
                  <input
                    class=' me-2'
                    type='search'
                    placeholder='Search item here...'
                    aria-label='Search'
                  />
                  <button class='market_btn' type='submit'>
                    <img src='../img/search.svg' alt='' />
                  </button>
                </form>
                <select
                  class='market_select_form form-select'
                  aria-label='Default select example'
                  style={bgImgarrow}>
                  <option value='all' selected>
                    All NFTs
                  </option>
                  <option value='buyNow'>Buy Now</option>
                  <option value='onAuction'>On Auction</option>
                  <option value='notForSale'>Not for Sale</option>
                </select>
                <select
                  class='market_select_form form-select'
                  aria-label='Default select example'
                  style={bgImgarrow}>
                  <option value='1' selected>
                    Price: Low to High
                  </option>
                  <option value='2'>Price: High to Low</option>
                </select>
                {/* <div className="market_div"> */}

                <div id='gridtwo' className='market_grid' onClick={gridtwo}>
                  <Twogrid />
                </div>
                <div id='gridthree' className='market_grid' onClick={gridthree}>
                  <Threegrid />
                </div>
                {/* </div> */}
                {/* <button
                  type='button'
                  className='filter_btn'
                  onClick={filterToggle}>
                  Adv.Filter
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='collection_list mb-5 pb-5'>
        <div className='container'>
          <div className='row'>
            {
            nftList.length > 0 ? nftList?.map((n, k) =>{
              return (
                <div className={grid} key={k}>
                  <CollectionList
                    nft={n}
                    collectionName={collectionDetails?.name}
                  />
                </div>
              )
            }) : ""
            }

            {nftList ? (
              <div class='col-md-12 text-center mt-5'>
                <button class={`btn view_all_bdr ${loadMoreDisabled}`} onClick={() => setLoadMore(!loadMore)}>
                  Load More
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Collection;
