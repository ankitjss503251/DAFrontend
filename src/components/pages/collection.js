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
import { getCollections, getNFTs } from "../../helpers/getterFunctions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import arrow from "./../../assets/images/ep_arrow-right-bold.png";

const bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};



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
  const [nftList, setNftList] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Wallet", "", 800);
    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [currentUser]);

  const [togglemode, setTogglemode] = useState("filterhide");
  const [currPage, setCurrPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
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
    let temp = nftList;
    try {
      const reqData = {
        page: 1,
        limit: 12,
        collectionID: id,
      };
      const res = await getCollections(reqData);

      setCollectionDetails(res[0]);
      const data = {
        page: currPage,
        limit: 1,
        collectionID: res[0]._id,
      };
      const nfts = await getNFTs(data);
      if (nfts.length > 0) {
        temp = [...temp, nfts];
        setNftList(temp);
        setCurrPage(currPage + 1);
      }
      console.log("collll", res[0]);
    } catch (e) {
      console.log("Error in fetching all collections list", e);
    }
  }, [loadMore]);

  return (
    <div style={bgImgStyle}>
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
                {collectionDetails?.contractAddress?.slice(0, 8) +
                  "...." +
                  collectionDetails?.contractAddress?.slice(32, 42)}
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
                  <option selected>Single Items</option>
                  <option value='1'>Single Items 1</option>
                  <option value='2'>Single Items 2</option>
                  <option value='3'>Single Items 3</option>
                </select>
                <select
                  class='market_select_form form-select'
                  aria-label='Default select example'
                  style={bgImgarrow}>
                  <option selected>Price: Low to High</option>
                  <option value='1'>$2000</option>
                  <option value='2'>$4000</option>
                  <option value='3'>$6000</option>
                </select>
                {/* <div className="market_div"> */}

                <div id='gridtwo' className='market_grid' onClick={gridtwo}>
                  <Twogrid />
                </div>
                <div id='gridthree' className='market_grid' onClick={gridthree}>
                  <Threegrid />
                </div>
                {/* </div> */}
                <button
                  type='button'
                  className='filter_btn'
                  onClick={filterToggle}>
                  Adv.Filter
                </button>
              </div>
            </div>
            <div className={`filter mb-5 ${togglemode}`}>
              <div className='filtercol'>
                <form>
                  <button
                    type='button'
                    class='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo'>
                    Status <UpArrow />
                  </button>
                  <div id='demo' class='collapse show'>
                    <ul className='status_ul'>
                      <li>
                        <Link to={"/"} className='filter_border'>
                          Buy Now
                        </Link>
                        <Link to={"/"} className='filter_border'>
                          On Auction
                        </Link>
                      </li>
                      <li>
                        <Link to={"/"} className='filter_border'>
                          Now
                        </Link>
                        <Link to={"/"} className='filter_border'>
                          Offers
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <button
                    type='button'
                    class='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo2'>
                    Price <UpArrow />
                  </button>
                  <div id='demo2' class='collapse show'>
                    <ul className='status_ul'>
                      <li>
                        <select
                          class='form-select filter_apply filter-text-left'
                          aria-label='Default select example'>
                          <option selected>$ Australian Dollar (AUD)</option>
                          <option value='1'>One</option>
                          <option value='2'>Two</option>
                          <option value='3'>Three</option>
                        </select>
                      </li>
                      <li>
                        <div class='range_input'>
                          <input
                            type='text'
                            class='form-control'
                            id='exampleInputPassword1'
                            placeholder='Min'
                          />
                          <span className='span_class'>to</span>
                          <input
                            type='text'
                            class='form-control'
                            id='exampleInputPassword1'
                            placeholder='Max'
                          />
                        </div>
                      </li>
                      <li>
                        <button type='submit' class='filter_apply'>
                          Apply
                        </button>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
              <div className='filtercol'>
                <form>
                  <button
                    type='button'
                    class='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo3'>
                    Collections <UpArrow />
                  </button>
                  <div id='demo3' class='collapse show'>
                    <input
                      type='text'
                      placeholder='Filter'
                      className='filter_apply filter-text-left filter_padd'
                    />
                  </div>
                </form>
              </div>
              <div className='filtercol'>
                <button
                  type='button'
                  class='drop_down_tlt mb-4'
                  data-bs-toggle='collapse'
                  data-bs-target='#demo4'>
                  Categories <UpArrow />
                </button>
                <div id='demo4' class='collapse show'>
                  <ul>
                    <li>
                      <Link to={"/marketplace"} className='sub-items'>
                        <AllNFTs />
                        All NFTs
                      </Link>
                    </li>
                    <li>
                      <Link to={"/marketplaceCollection"} className='sub-items'>
                        <Firearmsvg />
                        Firearms
                      </Link>
                    </li>
                    <li>
                      <Link to={"/Soldiers"} className='sub-items'>
                        <Soldierssvg />
                        Soldiers
                      </Link>
                    </li>
                    <li>
                      <Link to={"/Accesories"} className='sub-items'>
                        <Soldierssvg />
                        Accesories
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='filtercol'>
                <button
                  type='button'
                  class='drop_down_tlt mb-4'
                  data-bs-toggle='collapse'
                  data-bs-target='#demo5'>
                  On Sale In <UpArrow />
                </button>
                <div id='demo5' class='collapse show'>
                  <ul>
                    <li>
                      <input
                        type='text'
                        placeholder='Filter'
                        className='filter_apply  filter-text-left filter_padd'
                      />
                    </li>
                    <li>
                      <form action='#' className='checked_form'>
                        <div class='form-check form-check-inline'>
                          <input type='radio' id='test1' name='radio-group' />
                          <label for='test1'>Apple</label>
                        </div>
                        <div class='form-check form-check-inline'>
                          <input type='radio' id='test2' name='radio-group' />
                          <label for='test2'>Apple</label>
                        </div>
                      </form>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='collection_list mb-5 pb-5'>
        <div className='container'>
          <div className='row'>
            {nftList
              ? nftList.map((card) => {
                  card[0] = { ...card[0], price: collectionDetails?.price };
                  return (
                    <div className={grid} key={card.id}>
                      <CollectionList
                        nft={card[0]}
                        collectionName={collectionDetails?.name}
                      />
                    </div>
                  );
                })
              : ""}
            {nftList.length > 4 ?  <div class='col-md-12 text-center mt-5'>
              <a class='view_all_bdr' onClick={() => setLoadMore(!loadMore)}>
                Load More
              </a>
            </div> : ""}
           
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Collection;
