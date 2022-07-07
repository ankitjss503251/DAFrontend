import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import CollectionList from "../components/CollectionList";
import Relatedcollection from "../components/Relatedcollection";
import { Link, NavLink, useParams } from "react-router-dom";
import ItemSVG from "../SVG/ItemSVG";
import ActivitySVG from "../SVG/ActivitySVG";
import Threegrid from "../SVG/Threegrid";
import Twogrid from "../SVG/Twogrid";
import UpArrow from "../SVG/dropdown";
import {
  getBrandDetailsById,
  getCollections,
  getNFTs,
  getCategory,
  getPrice,
  getUserById
} from "../../helpers/getterFunctions";
import arrow from "./../../assets/images/ep_arrow-right-bold.png";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import CollectionsNFT from "../components/Skeleton/CollectionsNFT";
import BGImg from "../../assets/images/background.jpg";
import { convertToEth } from "../../helpers/numberFormatter";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { getAllBrands } from "../../apiServices";

function CollectionWithCollection() {
  const bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  const { brandID } = useParams();
  const [brandDetails, setBrandDetails] = useState([]);
  const [user, setUser] = useState([]);
  const [collections, setCollections] = useState([]);
  const [togglemode, setTogglemode] = useState("filterhide");
  const [nfts, setNfts] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [category, setCategory] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [cardCount, setCardCount] = useState(0);
  const [searchFor, setSearchFor] = useState("");
  const [ERCType, setERCType] = useState();
  const [brands, setBrands] = useState([]);

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
    try {
      const b = await getAllBrands();
      setBrands(b);
      console.log("brands", b);
    } catch (e) {
      console.log("Error", e);
    }
  }, []);

  var bgImgarrow = {
    backgroundImage: `url(${arrow})`,
    backgroundRepeat: "no-repeat",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gridtwo = () => {
    setgrid("col-md-6 mb-4");
    document.getElementById("gridtwo").classList.add("active");
    document.getElementById("gridthree").classList.remove("active");
  };

  const gridthree = () => {
    setgrid("col-md-4 mb-4");
    document.getElementById("gridthree").classList.add("active");
    document.getElementById("gridtwo").classList.remove("active");
  };

  const [grid, setgrid] = useState("col-md-3 mb-4");

  useEffect(async () => {
    setLoader(true);
    try {
      const brand = await getBrandDetailsById(brandID);
      setBrandDetails(brand);
      const user = await getUserById({
        page: 1,
        limit: 4,
        userID: brand?.createdBy,
      });
      setUser(user);
      const cols = await getCollections({
        brandID: brandID,
      });
      setCollections(cols);
      let temp = [];
      let cnt = 0;
      for (let i = 0; i < cols.length; i++) {
        const nft = await getNFTs({
          page: currPage,
          limit: 12,
          collectionID: cols[i]?._id,
          searchText: searchFor,
          ERCType: ERCType,
        });
        setCardCount(cardCount + nft.length);
        if (nft.length > 0) {
          for (let j = 0; j < nft.length; j++) {
            const order = await getPrice({
              nftID: nft[j].id,
            });
            nft[j] = {
              ...nft[j],
              price:
                order?.price?.$numberDecimal === undefined
                  ? "--"
                  : Number(convertToEth(order?.price?.$numberDecimal))
                      .toFixed(6)
                      .slice(0, -2),
              saleType: order?.salesType,
            };
            temp[cnt] = {
              ...nft[j],
              collectionName: cols[i]?.name,
            };
            console.log("nft", temp[cnt]);
            cnt++;
          }
        }
        if (nfts && nft.length <= 0) {
          setLoader(false);
          setLoadMoreDisabled("disabled");
          return;
        }
      }
      setNfts(temp);
      setLoader(false);
    } catch (e) {
      console.log("error in get brandbyID", e);
    }
  }, [currPage, searchFor, ERCType]);

  const bgImage = {
    backgroundImage: `url(${brandDetails?.coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div style={bgImgStyle}>
      {loadMoreDisabled && nfts.length > 0
        ? NotificationManager.info("No more items to load", "", 800)
        : ""}
      <section className='collection_banner pdd_8' style={bgImage}></section>
      <section className='collection_info'>
        <div className='container'>
          <div className='collection_pick'>
            <img
              alt=''
              src={brandDetails?.logoImage}
              class='img-fluid collection_profile'
              onError={(e) => (e.target.src = "../img/collections/list4.png")}
            />
            {/* <img
              alt=''
              src={"../img/collections/check.png"}
              class='img-fluid check_img'
            /> */}
          </div>
          <h1 className='collection_title text-center'>{brandDetails?.name}</h1>
          <ul class='collection_social mb-4'>
            <li>
              <a href='/'>
                <i class='fa fa-facebook fa-lg'></i>
              </a>
            </li>
            <li>
              <a href='/'>
                <i class='fa fa-twitter fa-lg'></i>
              </a>
            </li>
            <li>
              <a href='/'>
                <i class='fa fa-linkedin fa-lg'></i>
              </a>
            </li>
            <li>
              <a href='/'>
                <i class='fa fa-pinterest fa-lg'></i>
              </a>
            </li>
          </ul>
          {/* <div className='coppycode text-center'>
            <span className='ctc'>
              <img alt='' src={"../img/favicon.png"} class='img-fluid' />
              <div className=''>
                {user?.walletAddress?.slice(0, 8) +
                  "...." +
                  user?.walletAddress?.slice(32, 42)}
              </div>

              <CopyToClipboard
                text={user?.walletAddress}
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
          </div> */}

          <ul className='collection_status mt-5 mb-5'>
            <li>
              <h4>{brandDetails?.nftCount}</h4>
              <p>items</p>
            </li>
            <li>
              <h4>-</h4>
              <p>owners</p>
            </li>
            <li>
              <h4>-</h4>
              <p>floor price</p>
            </li>
            <li>
              <h4>-</h4>
              <p>volume traded</p>
            </li>
          </ul>
          <div className='collection_description text-center'>
            <p>{brandDetails?.description}</p>
            <span className='top_arrow'>
              <img alt='' src={"../img/top_arrow.png"} class='img-fluid' />
            </span>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <h4 className='second_hd text-center mb-3'>Collection</h4>
            </div>
          </div>
          <Relatedcollection collections={collections} />

          <div className='row'>
            <div className='col-md-12 text-center item_active'>
              <ul className='author_cart nav' role='tablist'>
                <li classname='item_active'>
                  <a
                    data-bs-toggle='pill'
                    data-bs-target='#pills-Items'
                    role='tab'
                    aria-controls='pills-Items'
                    aria-selected='true'
                    className='active'>
                    <span className='mr-3'>
                      <ItemSVG />
                    </span>{" "}
                    <span >
                      Items
                      </span>
                  </a>
                </li>
                <li classname='item_active'>
                  <a
                    data-bs-toggle='pill'
                    data-bs-target='#pills-Activity'
                    role='tab'
                    aria-controls='pills-Activity'
                    aria-selected='true'>
                    <span className='mr-3'>
                      <ActivitySVG />
                    </span>{" "}
                   <span>
                    Activity
                    </span> 
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className='collection_list mb-5 pb-5'>
        <div className='container'>
          <div className='tab-content' id='pills-tabContent'>
            <div
              className='tab-pane fade show active'
              id='pills-Items'
              role='tabpanel'
              aria-labelledby='pills-Items-tab'>
            {nfts?.length > 0 ? 
             <div className='row'>
                <div className='col-lg-12  mb-5'>
                  <div className='market_search_form'>
                    <form class='d-flex marketplace_form'>
                      <input
                        class=' me-2'
                        type='search'
                        placeholder='Search item here...'
                        aria-label='Search'
                        value={searchFor}
                        onChange={(e) => {
                          setNfts([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setSearchFor(e.target.value);
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
                        setNfts([]);
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
                    <div
                      id='gridthree'
                      className='market_grid'
                      onClick={gridthree}>
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
                  {/* <div className='search_qt mt-3'>10,000 items</div> */}
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
                        <li className='sub-items'>
                          <form action='#' className='checked_form'>
                            <div class='form-check form-check-inline'>
                              <input
                                type='radio'
                                id='allnfts'
                                name='radio-group'
                              />
                              <label for='allnfts'>All NFTs</label>
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
                        <li>
                          <input
                            type='text'
                            placeholder='Filter'
                            className='filter_apply  filter-text-left filter_padd'
                          />
                        </li>
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
                                        checked={b.name === brandDetails.name ? "checked" : ""}
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
           :""} 
              <div className='row'>
                {loader ? (
                  <CollectionsNFT cards={cardCount} grid={grid} />
                ) : nfts?.length > 0 ? (
                  nfts?.map((card) => {
                    return (
                      <div className={grid} key={card.id}>
                        <CollectionList nft={card} />
                      </div>
                    );
                  })
                ) : (
                  <h2 className='text-white text-center'>No NFT Found</h2>
                )}
                {nfts.length > 6 && (
                  <div class='col-md-12 text-center mt-5'>
                    <button
                      type='button'
                      className={`btn view_all_bdr ${loadMoreDisabled}`}
                      onClick={() => {
                        setCurrPage(currPage + 1);
                      }}>
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-Activity'
              role='tabpanel'
              aria-labelledby='pills-Activity-tab'>
              <div className='row'>
                <div className='col-md-6 d-md-inline-flex'>
                  <select
                    class='action_select_form form-select mr-3'
                    aria-label='Default select example'
                    style={bgImgarrow}>
                    <option selected>Listings</option>
                    <option value='1'>Listings Items 1</option>
                    <option value='2'>Listings Items 2</option>
                    <option value='3'>Listings Items 3</option>
                  </select>
                  <select
                    class='action_select_form form-select'
                    aria-label='Default select example'
                    style={bgImgarrow}>
                    <option selected>Hunter Token</option>
                    <option value='1'>Hunter Token 1</option>
                    <option value='2'>Hunter Token 2</option>
                    <option value='3'>Hunter Token 3</option>
                  </select>
                </div>
                <div className='col-md-6 d-flex justify-content-end'>
                  <select
                    class='action_select_form form-select'
                    aria-label='Default select example'
                    style={bgImgarrow}>
                    <option selected>Last 90 Days</option>
                    <option value='1'>Last 40 Days</option>
                    <option value='2'>Last 30 Days</option>
                    <option value='3'>Last 10 Days</option>
                  </select>
                </div>
              </div>
              <section className='collectionAction mb-5 pb-5 mt-5'>
                <div className='container'>
                  <div className='row'>
                    <div className='col-md-12'>
                      <img
                        alt=''
                        src={"../img/collections/graph.png"}
                        class='img-fluid'
                      />
                    </div>
                  </div>
                  <div className='row mt-5'>
                    <div className='col-md-12'>
                      <div class='table-responsive'>
                        <table className=' Action_table text-center'>
                          <tr className=''>
                            <th>
                              <div className='tb_title'>List</div>
                            </th>
                            <th>
                              <div className='tb_title'>Item</div>
                            </th>
                            <th>
                              <div className='tb_title'>Price</div>
                            </th>
                            <th>
                              <div className='tb_title'>Quantity</div>
                            </th>
                            <th>
                              <div className='tb_title'>From</div>
                            </th>
                            <th>
                              <div className='tb_title'>To</div>
                            </th>
                            <th>
                              <div className='tb_title'>Time</div>
                            </th>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/bxs_purchase-tag.png"}
                                class='img-fluid'
                              />{" "}
                              List
                            </td>
                            <td>
                              <img
                                alt=''
                                src={"../img/collections/item1.png"}
                                class='img-fluid'
                              />{" "}
                              Firearms #5234
                            </td>
                            <td>
                              <p className='table_p'>
                                <img
                                  alt=''
                                  src={"../img/collections/hhh.png"}
                                  class='img-fluid'
                                />{" "}
                                99.95
                              </p>
                              <span className='special_text'>$591,623.15</span>
                            </td>
                            <td>1</td>
                            <td>UserName</td>
                            <td>UserName</td>
                            <td>an hour ago</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className='row mt-5'>
                    <div class='col-md-12 text-center '>
                      <a class='view_all_bdr' href='/'>
                        Load More
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CollectionWithCollection;
