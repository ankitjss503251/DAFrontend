import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Threegrid from "../SVG/Threegrid";
import Twogrid from "../SVG/Twogrid";
import {
  getBrandDetailsById,
  getCategory,
  getCollections,
  getNFTs,
  getPrice,
} from "../../helpers/getterFunctions";
import { Link, useParams } from "react-router-dom";
import { convertToEth } from "../../helpers/numberFormatter";
import UpArrow from "../SVG/dropdown";
import bgImg from "./../../assets/marketplace-bg.jpg";
import { NotificationManager } from "react-notifications";
import { getAllBrands } from "../../apiServices";
import BGImg from "./../../assets/images/background.jpg";
import SkeletonCard from "../components/Skeleton/NFTSkeletonCard";

var bgImgarrow = {
  backgroundImage: "url(./img/ep_arrow-right-bold.png)",
  backgroundRepeat: "no-repeat",
};

function Marketplace() {
  var bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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

  var register_bg = {
    backgroundImage: `url(${bgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  };

  const [grid, setgrid] = useState("col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4");

  const [allNFTs, setAllNFTs] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const { searchedText } = useParams();
  const [loadMore, setLoadMore] = useState(false);
  const [togglemode, setTogglemode] = useState("filterhide");
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [category, setCategory] = useState([]);
  const [sText, setSText] = useState("");
  const [brands, setBrands] = useState([]);
  const [cols, setCols] = useState([]);
  const [colsAdv, setColsAdv] = useState("");
  const [ERCType, setERCType] = useState();
  const [activeSaleType, setActiveSaleType] = useState(-1);
  const [loader, setLoader] = useState(false);
  const [cardCount, setCardCount] = useState(0);

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
      const b = await getAllBrands();
      setBrands(b);
    } catch (e) {
      console.log("Error", e);
    }
    try {
      const c = await getCategory();
      setCategory(c);
    } catch (e) {
      console.log("Error", e);
    }
  }, []);

  useEffect(async () => {
    setLoader(true);
    let temp = allNFTs;
    try {
      const reqData = {
        page: currPage,
        limit: 12,
        searchText: sText ? sText : searchedText ? searchedText : "",
        isOnMarketplace: 1,
        ERCType: ERCType,
        salesType: activeSaleType !== -1 ? activeSaleType : "",
      };
      const res = await getNFTs(reqData);
      setCardCount(cardCount + res.length);
      if (res.length > 0) {
        setLoadMoreDisabled("");
        for (let i = 0; i < res.length; i++) {
          const orderDet = await getPrice({
            nftID: res[i].id,
          });

          const brandDet = await getBrandDetailsById(
            res[i].collectionData[0].brandID
          );
          console.log("brandDetail", brandDet);
          res[i] = {
            ...res[i],
            salesType: orderDet?.salesType,
            price:
              orderDet?.price?.$numberDecimal === undefined
                ? "--"
                : Number(convertToEth(orderDet?.price?.$numberDecimal))
                    .toFixed(6)
                    .slice(0, -2),
            brand: brandDet,
          };
        }
        console.log("res", res);
        temp = [...temp, res];
        setAllNFTs(temp);
        setLoader(false);
      }
      if (allNFTs && res.length <= 0) {
        setLoader(false);
        setLoadMoreDisabled("disabled");
      }
    } catch (e) {
      console.log("Error in fetching all NFTs list", e);
    }
  }, [loadMore, ERCType, sText, activeSaleType]);

  return (
    <div>
      {loadMoreDisabled && allNFTs.length > 0
        ? NotificationManager.info("No more items to load", "", 800)
        : ""}
      <section className='register_hd pdd_12' style={register_bg}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h1>Marketplace</h1>
            </div>
          </div>
        </div>
      </section>
      <section className='marketplacecollection pdd_8' style={bgImgStyle}>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='market_search_form mb-5'>
                <form class='d-flex marketplace_form'>
                  <input
                    class=' me-2'
                    type='search'
                    placeholder='Search item here...'
                    aria-label='Search'
                    value={sText}
                    onChange={(e) => {
                      setAllNFTs([]);
                      setCurrPage(1);
                      setCardCount(0);
                      setSText(e.target.value);
                      setLoadMoreDisabled("");
                    }}
                  />
                  <button class='market_btn' type='submit'>
                    <img src='../img/search.svg' alt='' />
                  </button>
                </form>
                <select
                  class='market_select_form form-select'
                  aria-label='Default select example'
                  style={bgImgarrow}
                  value={ERCType}
                  onChange={(e) => {
                    setAllNFTs([]);
                    setCurrPage(1);
                    setCardCount(0);
                    setERCType(parseInt(e.target.value));
                    setLoadMoreDisabled("");
                  }}>
                  <option value='0' selected>
                    All Items
                  </option>
                  <option value='1'>Single Items</option>
                  <option value='2'>Multiple Items</option>
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
                    <ul className='status_ul d-flex flex-wrap'>
                      <li
                        className={`filter_border mr-2 ${
                          activeSaleType === 3 ? "active" : ""
                        }`}
                        value='3'
                        onClick={(e) => {
                          setAllNFTs([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setActiveSaleType(e.target.value);
                          setLoadMoreDisabled("");
                        }}>
                        All NFTs
                      </li>
                      <li
                        className={`filter_border mr-2 ${
                          activeSaleType === 4 ? "active" : ""
                        }`}
                        value='4'
                        onClick={(e) => {
                          setAllNFTs([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setActiveSaleType(e.target.value);
                          setLoadMoreDisabled("");
                        }}>
                        Not For Sale
                      </li>
                      <li
                        className={`filter_border mr-2 ${
                          activeSaleType === 0 ? "active" : ""
                        }`}
                        value='0'
                        onClick={(e) => {
                          setAllNFTs([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setActiveSaleType(e.target.value);
                          setLoadMoreDisabled("");
                        }}>
                        Buy Now
                      </li>
                      <li
                        className={`filter_border mr-2 ${
                          activeSaleType === 1 ? "active" : ""
                        }`}
                        value='1'
                        onClick={(e) => {
                          setAllNFTs([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setActiveSaleType(e.target.value);
                          setLoadMoreDisabled("");
                        }}>
                        On Auction
                      </li>
                    </ul>
                  </div>

                  {/* <button
                    type='button'
                    class='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo2'>
                    Price <UpArrow />
                  </button> */}
                  {/* <div id='demo2' class='collapse show'>
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
                  </div> */}
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
                  <div id='demo3' class='collapse show '>
                    <input
                      type='text'
                      placeholder='Filter'
                      className='filter_apply filter-text-left filter_padd mb-3'
                      value={colsAdv}
                      onChange={async (e) => {
                        setColsAdv(e.target.value);
                        const reqData = {
                          page: 1,
                          limit: 12,
                          searchText: e.target.value,
                        };
                        try {
                          const col = await getCollections(reqData);
                          setCols(col);
                        } catch (e) {
                          console.log("Error", e);
                        }
                      }}
                    />
                    {cols && cols.length > 0 && colsAdv !== ""
                      ? cols.map((i) => {
                          return (
                            <div class='form-check form-check-inline'>
                              <input
                                type='radio'
                                id={i.name}
                                name='radio-group'
                              />
                              <label for={i.name}>{i.name}</label>
                            </div>
                          );
                        })
                      : ""}
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
                    <li className='sub-items'>
                      <form action='#' className='checked_form'>
                        <div class='form-check form-check-inline'>
                          <input type='radio' id='all' name='radio-group' />
                          <label for='all'>All</label>
                        </div>
                        {category
                          ? category.map((c) => {
                              return (
                                <div class='form-check form-check-inline'>
                                  <input
                                    type='radio'
                                    id={c.name}
                                    name='radio-group'
                                  />
                                  <label for={c.name}>{c.name}</label>
                                </div>
                              );
                            })
                          : ""}
                      </form>
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
                  Brands <UpArrow />
                </button>
                <div id='demo5' class='collapse show'>
                  <ul>
                    {/* <li>
                      <input
                        type='text'
                        placeholder='Filter'
                        className='filter_apply  filter-text-left filter_padd'
                      />
                    </li> */}
                    <li>
                      <form action='#' className='checked_form'>
                        {brands
                          ? brands.map((b) => {
                              return (
                                <div class='form-check form-check-inline'>
                                  <input
                                    type='radio'
                                    id={b.name}
                                    name='radio-group'
                                  />
                                  <label for={b.name}>{b.name}</label>
                                </div>
                              );
                            })
                          : ""}
                      </form>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            {loader ? (
              <SkeletonCard cards={cardCount} grid={grid} />
            ) : allNFTs?.length > 0 ? (
              allNFTs.map((oIndex) => {
                return oIndex.map((card, key) => {
                  return (
                    <div className={grid}>
                      <div className='items_slide h-100' key={key}>
                        <div className='items_profileimg'>
                          <a href={`/collectionwithcollection/${card?.brand?._id}`}>
                            <div className='profile_left nft-logo-img'>
                              <img
                                alt=''
                                className='profile_img '
                                src={card.brand?.logoImage}
                                onError={(e) =>
                                  (e.target.src =
                                    "../img/collections/list4.png")
                                }
                              />
                              {/* <img
                                alt=''
                                className='icheck_img'
                                src={"../img/collections/check.png"}
                              /> */}
                            </div>
                          </a>
                        </div>
                        <a href={`/NFTdetails/${card.id}`} className='nft-cont'>
                          <img
                            alt=''
                            onError={(e) => {
                              e.target.src = "../img/collections/list4.png";
                            }}
                            src={card.image}
                            class='img-fluid items_img w-100 my-3'
                          />
                        </a>
                        <div className='items_text nft-info-div'>
                          <div className='items_info '>
                            <div className='items_left'>
                              <h3 className=''>{card.name}</h3>
                              <p>{card.price} HNTR</p>
                            </div>
                            <div className='items_right justify-content-end d-flex'>
                              <span>
                                <svg
                                  width='16'
                                  height='14'
                                  viewBox='0 0 16 14'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'>
                                  <path
                                    d='M15.1062 2.75379C14.866 2.21491 14.5197 1.72658 14.0866 1.31613C13.6532 0.904465 13.1422 0.577318 12.5814 0.352482C11.9998 0.118416 11.3761 -0.00139215 10.7464 1.22043e-05C9.86295 1.22043e-05 9.00102 0.234414 8.25198 0.677172C8.07278 0.783086 7.90255 0.899419 7.74127 1.02617C7.57999 0.899419 7.40976 0.783086 7.23056 0.677172C6.48152 0.234414 5.61959 1.22043e-05 4.73615 1.22043e-05C4.10001 1.22043e-05 3.48357 0.118081 2.90118 0.352482C2.33851 0.578202 1.83138 0.902892 1.39594 1.31613C0.962277 1.72611 0.615857 2.21456 0.376312 2.75379C0.127229 3.31462 0 3.91017 0 4.52309C0 5.10128 0.121853 5.70378 0.363768 6.31669C0.56626 6.82891 0.856557 7.36021 1.22749 7.89673C1.81526 8.74579 2.62343 9.6313 3.62693 10.529C5.28987 12.017 6.93668 13.0449 7.00657 13.0866L7.43126 13.3505C7.61942 13.4668 7.86133 13.4668 8.04949 13.3505L8.47418 13.0866C8.54407 13.0431 10.1891 12.017 11.8538 10.529C12.8573 9.6313 13.6655 8.74579 14.2533 7.89673C14.6242 7.36021 14.9163 6.82891 15.117 6.31669C15.3589 5.70378 15.4808 5.10128 15.4808 4.52309C15.4825 3.91017 15.3553 3.31462 15.1062 2.75379Z'
                                    fill='#AAAAAA'
                                  />
                                </svg>
                                {card.like}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/NFTdetails/${card.id}`}
                            className='border_btn width-100 title_color'>
                            {card.salesType === 0
                              ? "Buy Now"
                              : card.salesType === 1 || card.salesType === 2
                              ? "Place Bid"
                              : "View"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                });
              })
            ) : (
              <h2 className='text-white text-center'>No NFT Found</h2>
            )}
          </div>
          {allNFTs?.length > 0 ? (
            <div className='row'>
              <div class='col-md-12 text-center mt-5'>
                <button
                  type='button'
                  className={`btn view_all_bdr ${loadMoreDisabled}`}
                  onClick={() => {
                    setCurrPage(currPage + 1);
                    setLoadMore(!loadMore);
                  }}>
                  Load More
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Marketplace;
