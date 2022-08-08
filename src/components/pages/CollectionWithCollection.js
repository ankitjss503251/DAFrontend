import React, { useState, useEffect, Suspense, useRef } from "react";
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
  getUserById,
  fetchHistory
} from "../../helpers/getterFunctions";
import arrow from "./../../assets/images/ep_arrow-right-bold.png";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import CollectionsNFT from "../components/Skeleton/CollectionsNFT";
import BGImg from "../../assets/images/background.jpg";
import { convertToEth } from "../../helpers/numberFormatter";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { getAllBrands } from "../../apiServices";
import AdvancedFilter from "../components/AdvancedFilter";
import {
  Canvas, useFrame,
  extend,
  useThree
} from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Tokens } from "../../helpers/tokensToSymbol";
import moment from "moment";

//extend({OrbitControls});

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  const {
    camera,
    gl: { domElement },
  } = useThree();
  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};


function CollectionWithCollection() {
  // const bgImgStyle = {
  //   backgroundImage: `url(${BGImg})`,
  //   backgroundRepeat: "no-repeat",
  //   backgroundSize: "cover",
  //   backgroundPositionX: "center",
  //   backgroundPositionY: "center",
  //   backgroundColor: "#000",
  // };

  const { brandID } = useParams();
  const [brandDetails, setBrandDetails] = useState([]);
  const [user, setUser] = useState([]);
  const [collections, setCollections] = useState([]);
  const [togglemode, setTogglemode] = useState("filterhide");
  const [nfts, setNfts] = useState([]);
  const [salesType, setSalesType] = useState("");
  const [category, setCategory] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [cardCount, setCardCount] = useState(0);
  const [searchFor, setSearchFor] = useState("");
  const [ERCType, setERCType] = useState();
  const [brands, setBrands] = useState([]);
  const [priceSort, setPriceSort] = useState("ASC");
  const [searchedCol, setSearchedCol] = useState("");
  const [searchedBrand, setSearchedBrand] = useState("");
  const [searchedCat, setSearchedCat] = useState("");
  const [history, setHistory] = useState([]);

  const filterToggle = () => {
    setLoadMoreDisabled("");
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

  useEffect(() => {
    const fetch = async () => {
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
    };
    fetch();
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

  useEffect(() => {
    const fetch = async () => {
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
        let temp = nfts;
        const nft = await getNFTs({
          page: currPage,
          limit: 12,
          brandID: brandID,
          searchText: searchFor ? searchFor : "",
          ERCType: ERCType,
          salesType: salesType >= 0 ? salesType : "",
          priceSort: priceSort,
          categoryID: searchedCat,
          brandID: brandID,
          collectionID: searchedCol,
        });

        setCardCount(cardCount + nft.length);
        if (nft.length > 0) {
          for (let i = 0; i < nft.length; i++) {
            const order = await getPrice(nft[i].orderData);
            nft[i] = {
              ...nft[i],
              price:
                order?.price?.$numberDecimal === undefined
                  ? "--"
                  : Number(convertToEth(order?.price?.$numberDecimal))
                    .toFixed(6)
                    .slice(0, -2),
              saleType: order?.salesType,
              paymentToken: order?.paymentToken,
              collectionName: nft[i].collectionData[0].name,
            };
          }
          temp = [...temp, nft];

          setNfts(temp);
          setLoader(false);
        } else {
          setLoader(false);
          setLoadMoreDisabled("disabled");
          return;
        }
      } catch (e) {
        console.log("error in get brandbyID", e);
      }
    };
    fetch();
  }, [
    currPage,
    searchFor,
    ERCType,
    priceSort,
    searchedBrand,
    searchedCat,
    searchedCol,
    salesType,
  ]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const reqData = {
          page: 1,
          limit: 12,
          brandID: brandID
        }
        const _h = await fetchHistory(reqData);
        console.log("history on brands page", _h)
        setHistory(_h);
      }
      catch (e) {
        console.log(e);
      }
    }
    fetch();
  }, [])

  const bgImage = {
    backgroundImage: `url(${brandDetails?.coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleAdvSearch = (data) => {
    setNfts([]);
    setCurrPage(1);
    setCardCount(0);
    setLoadMoreDisabled("");
    if (data.type === "salesType") setSalesType(data.value);
    if (data.type === "collection") setSearchedCol(data.value);
    if (data.type === "brand") setSearchedBrand(data.value);
    if (data.type === "category") setSearchedCat(data.value);
  };

  return (
    <div>
      {/* {loadMoreDisabled 
        ? NotificationManager.info("No more items to load", "", 800)
        : ""} */}
      <section className='collection_banner pdd_8' style={bgImage}></section>
      <section className='collection_info'>
        <div className='container'>
          <div className='collection_pick'>
            <img
              alt=''
              src={brandDetails?.logoImage}
              className='img-fluid collection_profile'
              onError={(e) => (e.target.src = "../img/collections/list4.png")}
            />
            {/* <img
              alt=''
              src={"../img/collections/check.png"}
              className='img-fluid check_img'
            /> */}
          </div>
          <h1 className='collection_title text-center'>{brandDetails?.name}</h1>
          {/* <div className='coppycode text-center'>
            <span className='ctc'>
              <img alt='' src={"../img/favicon.png"} className='img-fluid' />
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
              <h4>{cardCount}</h4>
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
              <img alt='' src={"../img/top_arrow.png"} className='img-fluid' />
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
                    <span>Items</span>
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
                    <span>Activity</span>
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
              <div className='row'>
                <div className='col-lg-12  mb-5'>
                  <div className='market_search_form'>
                    <form className='d-flex marketplace_form'>
                      <input
                        className=' me-2'
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
                      <button className='market_btn' type='submit'>
                        <img src='../img/search.svg' alt='' />
                      </button>
                    </form>
                    <select
                      className='market_select_form form-select'
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
                      className='market_select_form form-select'
                      aria-label='Default select example'
                      style={bgImgarrow}
                      onChange={(e) => {
                        setNfts([]);
                        setCurrPage(1);
                        setCardCount(0);
                        setLoadMoreDisabled("");
                        setPriceSort(e.target.value);
                      }}>
                      <option value='ASC' defaultValue>
                        Price: Low to High
                      </option>
                      <option value='DESC'>Price: High to Low</option>
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
                <AdvancedFilter
                  togglemode={togglemode}
                  category={category}
                  brands={brands}
                  onAdvSearch={handleAdvSearch}
                  brandName={brandDetails?.name}
                />
                {/* <div className={`filter mb-5 ${togglemode}`}>
                  <div className="filtercol">
                    <form>
                      <button
                        type="button"
                        className="drop_down_tlt"
                        data-bs-toggle="collapse"
                        data-bs-target="#demo"
                      >
                        Status <UpArrow />
                      </button>
                      <div id="demo" className="collapse show">
                        <ul className="status_ul">
                          <li>
                            <a href={"/"} className="filter_border">
                              Buy Now
                            </a>
                            <a href={"/"} className="filter_border">
                              On Auction
                            </a>
                          </li>
                          <li>
                            <a href={"/"} className="filter_border">
                              Now
                            </a>
                            <a href={"/"} className="filter_border">
                              Offers
                            </a>
                          </li>
                        </ul>
                      </div>

                       <button
                    type='button'
                    className='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo2'>
                    Price <UpArrow />
                  </button> 
                     <div id='demo2' className='collapse show'>
                    <ul className='status_ul'>
                      <li>
                        <select
                          className='form-select filter_apply filter-text-left'
                          aria-label='Default select example'>
                          <option selected>$ Australian Dollar (AUD)</option>
                          <option value='1'>One</option>
                          <option value='2'>Two</option>
                          <option value='3'>Three</option>
                        </select>
                      </li>
                      <li>
                        <div className='range_input'>
                          <input
                            type='text'
                            className='form-control'
                            id='exampleInputPassword1'
                            placeholder='Min'
                          />
                          <span className='span_class'>to</span>
                          <input
                            type='text'
                            className='form-control'
                            id='exampleInputPassword1'
                            placeholder='Max'
                          />
                        </div>
                      </li>
                      <li>
                        <button type='submit' className='filter_apply'>
                          Apply
                        </button>
                      </li>
                    </ul>
                  </div> 
                    </form>
                  </div>
                  <div className="filtercol">
                    <form>
                      <button
                        type="button"
                        className="drop_down_tlt"
                        data-bs-toggle="collapse"
                        data-bs-target="#demo3"
                      >
                        Collections <UpArrow />
                      </button>
                      <div id="demo3" className="collapse show">
                        <input
                          type="text"
                          placeholder="Filter"
                          className="filter_apply filter-text-left filter_padd"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="filtercol">
                    <button
                      type="button"
                      className="drop_down_tlt mb-4"
                      data-bs-toggle="collapse"
                      data-bs-target="#demo4"
                    >
                      Categories <UpArrow />
                    </button>
                    <div id="demo4" className="collapse show">
                      <ul>
                        <li className="sub-items">
                          <form action="#" className="checked_form">
                            <div className="form-check form-check-inline">
                              <input
                                type="radio"
                                id="allnfts"
                                name="radio-group"
                              />
                              <label for="allnfts">All NFTs</label>
                            </div>
                            {category
                              ? category?.map((c) => {
                                  return (
                                    <div className="form-check form-check-inline">
                                      <input
                                        type="radio"
                                        id={c.name}
                                        name="radio-group"
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
                  <div className="filtercol">
                    <button
                      type="button"
                      className="drop_down_tlt mb-4"
                      data-bs-toggle="collapse"
                      data-bs-target="#demo5"
                    >
                      Brands <UpArrow />
                    </button>
                    <div id="demo5" className="collapse show">
                      <ul>
                        <li>
                          <input
                            type="text"
                            placeholder="Filter"
                            className="filter_apply  filter-text-left filter_padd"
                          />
                        </li>
                        <li>
                          <form action="#" className="checked_form">
                            {brands
                              ? brands?.map((b) => {
                                  return (
                                    <div className="form-check form-check-inline">
                                      <input
                                        type="radio"
                                        id={b.name}
                                        name="radio-group"
                                        checked={
                                          b.name === brandDetails.name
                                            ? "checked"
                                            : ""
                                        }
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
                </div> */}
              </div>

              <div className='row'>
                { nfts?.length > 0 ? (
                  nfts.map((oIndex) => {
                    return oIndex?.map((card, key) => {
                      return (
                        <div className={grid} key={key}>
                          <CollectionList nft={card} />
                        </div>
                      );
                    });
                  })
                ) : (
                  <div className='col-md-12'>
                    <h4 className='no_data_text text-muted'>
                      No NFTs Available
                    </h4>
                  </div>
                )}
                {nfts[0]?.length > 12 && (
                  <div className='col-md-12 text-center mt-5'>
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
                    className='action_select_form form-select mr-3'
                    aria-label='Default select example'
                    style={bgImgarrow}>
                    <option selected>Listings</option>
                    <option value='1'>Listings Items 1</option>
                    <option value='2'>Listings Items 2</option>
                    <option value='3'>Listings Items 3</option>
                  </select>
                  <select
                    className='action_select_form form-select'
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
                    className='action_select_form form-select'
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
                  {/* <div className='row'>
                    <div className='col-md-12'>
                      <img
                        alt=''
                        src={"../img/collections/graph.png"}
                        className='img-fluid'
                      />
                    </div>
                  </div> */}
                  <div className='row mt-5'>
                    <div className='col-md-12'>
                      <div className='table-responsive'>
                        <table className=" Action_table text-center">
                          <thead>
                            <tr className="">
                              <th>
                                <div className="tb_title">List</div>
                              </th>
                              <th>
                                <div className="tb_title">Item</div>
                              </th>
                              <th>
                                <div className="tb_title">Price</div>
                              </th>
                              <th>
                                <div className="tb_title">Quantity</div>
                              </th>
                              <th>
                                <div className="tb_title">From</div>
                              </th>
                              <th>
                                <div className="tb_title">To</div>
                              </th>
                              <th>
                                <div className="tb_title">Time</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              history?.length > 0 ?
                                history?.map((h, i) => {
                                  return (
                                    <tr key={i}>
                                      <td className="text-left">
                                        <img
                                          alt=""
                                          src={"../img/collections/bxs_purchase-tag.png"}
                                          className="img-fluid"
                                        />{" "}
                                        {h.action}
                                      </td>
                                      <td className="d-flex justify-content-around align-items-center">
                                        <div className="hist_nft_img">
                                          <img
                                            alt=""
                                            src={h.nftImg}
                                            className="img-fluid"
                                            onError={(e) => {
                                              e.target.src = "../img/collections/item1.png"
                                            }}
                                          />  </div>{" "}
                                        {h.nftName}
                                      </td>
                                      <td>
                                        <p className="table_p d-flex justify-content-around">
                                          <div className="hist_tk">
                                            <img
                                              alt=''
                                              src={h?.paymentToken ? Tokens[h?.paymentToken?.toLowerCase()]?.icon : ""}
                                              className='img-fluid'
                                            />
                                          </div>
                                          {" "}
                                          {Number(convertToEth(h?.price))
                                            .toFixed(6)
                                            .slice(0, -2)}

                                        </p>
                                        <span className="special_text">$591,623.15</span>
                                      </td>
                                      <td>{h?.quantity}</td>
                                      <td> {(h?.action === "PutOnSale" || h?.action === "RemoveFromSale") ? (h?.sellerAddress?.slice(0, 4) + "..." + h?.sellerAddress?.slice(38, 42)) :
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
                                                    "0x0" : "0x0"}</td>
                                      <td> {h?.action === "PutOnSale" || h?.action === "RemoveFromSale" ? "0x0" :
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
                                                    "0x0" : "0x0"}</td>
                                      <td>{
                                        moment.utc(h?.createdOn).local().fromNow()
                                      }</td>
                                    </tr>)
                                })

                                : ""
                            }

                          </tbody>

                        </table>
                      </div>
                    </div>
                  </div>
                  {history?.length > 12 && <div className="row mt-5">
                    <div className="col-md-12 text-center ">
                      <a className="view_all_bdr" href="/">
                        Load More
                      </a>
                    </div>
                  </div>}
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
