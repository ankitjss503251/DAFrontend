import React, { useState, useEffect, Suspense, useRef } from "react";
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
import { useGLTF, OrbitControls } from "@react-three/drei";
import {
  Canvas, useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import { Tokens } from "../../helpers/tokensToSymbol";
import AdvancedFilter from "../components/AdvancedFilter";

var bgImgarrow = {
  backgroundImage: "url(./img/ep_arrow-right-bold.png)",
  backgroundRepeat: "no-repeat",
};
extend({ OrbitControls });

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
function Marketplace() {
  var bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };



  function Model(props) {
    const { scene } = useGLTF(props.image);
    return <primitive object={scene} />;
  }

  useEffect(() => {
    async function windowScroll() {
      window.scrollTo(0, 0);
    }
    windowScroll();
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
  const [ERCType, setERCType] = useState();
  const [salesType, setSalesType] = useState("");
  const [loader, setLoader] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [priceSort, setPriceSort] = useState("ASC");
  const [searchedCol, setSearchedCol] = useState();
  const [searchedBrand, setSearchedBrand] = useState("");
  const [searchedCat, setSearchedCat] = useState("");
  const [toggle, setToggle] = useState(false);

  const filterToggle = () => {
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
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoader(true);
      let temp = allNFTs;
      try {
        const reqData = {
          page: currPage,
          limit: 12,
          searchText: sText ? sText : searchedText ? searchedText : "",
          isOnMarketplace: 1,
          ERCType: ERCType,
          salesType: salesType >= 0 ? salesType : "",
          priceSort: priceSort,
          categoryID: searchedCat,
          brandID: searchedBrand,
          collectionID: searchedCol,
        };
        const res = await getNFTs(reqData);
        setCardCount(cardCount + res.length);
        if (res.length > 0) {
          setLoadMoreDisabled("");
          for (let i = 0; i < res.length; i++) {
            const orderDet = await getPrice(res[i].orderData);
            res[i] = {
              ...res[i],
              salesType: orderDet?.salesType,
              price:
                orderDet?.price?.$numberDecimal === undefined
                  ? "--"
                  : Number(convertToEth(orderDet?.price?.$numberDecimal))
                    .toFixed(6)
                    .slice(0, -2),
              paymentToken: orderDet?.paymentToken,
              brand: res[i].brandData,
            };
          }
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
    };
    fetch();
  }, [
    loadMore,
    ERCType,
    sText,
    salesType,
    priceSort, searchedBrand,
    searchedCat,
    searchedCol,
    toggle
  ]);

  const handleAdvSearch = (data) => {
    setAllNFTs([]);
    setCurrPage(1);
    setCardCount(0);
    setLoadMoreDisabled("");
    if (data.type === "salesType") {
      setSalesType(data.value);
    }
    if (data.type === "collection") {
      setToggle(!toggle)
      setSearchedCol(data.value);
    }
    if (data.type === "brand") {
      setSearchedBrand(data.value);
    }
    if (data.type === "category") {
      setSearchedCat(data.value);
    }
  };

  return (
    <div>
      {/*        
      {(loadMoreDisabled && allNFTs.length > 0)
        ? NotificationManager.info("No more items to load", "", 800)
        : ""} */}
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
                <form className='d-flex marketplace_form'>
                  <input
                    className=' me-2'
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
                  <button className='market_btn' type='button'>
                    <img src='../img/search.svg' alt='' />
                  </button>
                </form>
                <select
                  className='market_select_form form-select'
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
                  <option value='0' defaultValue>
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
                    setAllNFTs([]);
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
            <AdvancedFilter
              togglemode={togglemode}
              category={category}
              brands={brands}
              onAdvSearch={handleAdvSearch}
            />
            {/* <div className={`filter mb-5 ${togglemode}`}>
              <div className='filtercol'>
                <form>
                  <button
                    type='button'
                    className='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo'>
                    Status <UpArrow />
                  </button>
                  <div id='demo' className='collapse show'>
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
                        value='-1'
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
              <div className='filtercol'>
                <form>
                  <button
                    type='button'
                    className='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo3'>
                    Collections <UpArrow />
                  </button>
                  <div id='demo3' className='collapse show '>
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
                      ? cols.map((i, key) => {
                          return (
                            <div className='form-check form-check-inline' key={key}>
                              <input
                                type='radio'
                                id={i.name}
                                name='radio-group'
                                key={i}
                                
                              />
                              <label htmlFor={i.name}>{i.name}</label>
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
                  className='drop_down_tlt mb-4'
                  data-bs-toggle='collapse'
                  data-bs-target='#demo4'>
                  Categories <UpArrow />
                </button>
                <div id='demo4' className='collapse show'>
                  <ul>
                    <li className='sub-items'>
                      <form action='#' className='checked_form'>
                        <div className='form-check form-check-inline'>
                          <input type='radio' id='all' name='radio-group' />
                          <label htmlFor='all'>All</label>
                        </div>
                        {category.length > 0
                          ? category?.map((c, key) => {
                              return (
                                <div className='form-check form-check-inline' key={key}>
                                  <input
                                    type='radio'
                                    id={c.name}
                                    name='radio-group'
                                    key={c.name}
                                  />
                                  <label htmlFor={c.name}>{c.name}</label>
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
                  className='drop_down_tlt mb-4'
                  data-bs-toggle='collapse'
                  data-bs-target='#demo5'>
                  Brands <UpArrow />
                </button>
                <div id='demo5' className='collapse show'>
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
                        {brands.length > 0
                          ? brands?.map((b, key) => {
                              return (
                                <div className='form-check form-check-inline' key={key}>
                                  <input
                                    type='radio'
                                    id={b.name}
                                    name='radio-group'
                                    key={b}
                                  />
                                  <label htmlFor={b.name}>{b.name}</label>
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
            {allNFTs?.length > 0 ? (
              allNFTs.map((oIndex, key) => {
                return oIndex.map((card, key) => {
                  return (
                    <div className={grid} key={key}>
                      <div className='items_slide h-100' key={key}>
                        <div className='items_profileimg'>
                          <a
                            href={
                              card?.brand?._id
                                ? `/collectionwithcollection/${card?.brand?._id}`
                                : ``
                            }>
                            <div className='profile_left nft-logo-img'>
                              <img
                                alt=''
                                className='profile_img creatorImg'
                                src={
                                  card?.brand?.logoImage
                                }
                                key={card}
                                onError={(e) =>
                                (e.target.src =
                                  "../img/collections/list4.png")
                                }
                              />
                            </div>
                          </a>
                        </div>
                        <a href={`/NFTdetails/${card.id}`} className='nft-cont'>
                          {card && card.fileType === "Image" ? (
                            <img
                              src={card?.image}
                              className='img-fluid items_img w-100 my-3'
                              alt=''
                              onError={(e) => {
                                console.log("image error is--->", e);
                                e.target.src = "../img/collections/list4.png";
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {card && card.fileType === "Video" ? (
                            <video
                              className='img-fluid items_img w-100 my-3'
                              controls>
                              <source src={card?.image} type='video/mp4' />
                            </video>
                          ) : (
                            ""
                          )}

                          {card && card.fileType === "3D" ? (
                            // <Canvas
                            //   className='img-fluid items_img w-100 my-3'
                            //   camera={{ position: [10, 100, 100], fov: 1 }}>
                            //   <pointLight
                            //     position={[5, 10, 10]}
                            //     intensity={1.1}
                            //   />
                            //   <Suspense fallback={null}>
                            //     <Model image={card.image} />
                            //   </Suspense>
                            //   <CameraControls />
                            // </Canvas>
                            <img
                              src={card?.image}
                              className='img-fluid items_img w-100 my-3'
                              alt=''
                              onError={(e) => {
                                console.log("image error is--->", e);
                                e.target.src = card.previewImg;
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </a>
                        <div className='items_text nft-info-div'>
                          <div className='items_info '>
                            <div className='items_left'>
                              <h3 className=''>
                                {card?.name?.length > 15
                                  ? card?.name?.slice(0, 15) + "..."
                                  : card?.name}
                              </h3>
                              {card.paymentToken ? (
                                <div className='d-flex'>
                                  <div className='token_img'>
                                    <img
                                      src={
                                        Tokens[
                                          card?.paymentToken?.toLowerCase()
                                        ]?.icon
                                      }
                                      alt='payment token'
                                    />
                                  </div>
                                  <p>
                                    {" "}
                                    {card.price}{" "}
                                    {
                                      Tokens[card?.paymentToken?.toLowerCase()]
                                        ?.symbolName
                                    }{" "}
                                  </p>
                                </div>
                              ) : (
                                <p>--</p>
                              )}
                            </div>
                            {/* <div className="items_right justify-content-end d-flex">
                              <span>
                                <svg
                                  width="16"
                                  height="14"
                                  viewBox="0 0 16 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15.1062 2.75379C14.866 2.21491 14.5197 1.72658 14.0866 1.31613C13.6532 0.904465 13.1422 0.577318 12.5814 0.352482C11.9998 0.118416 11.3761 -0.00139215 10.7464 1.22043e-05C9.86295 1.22043e-05 9.00102 0.234414 8.25198 0.677172C8.07278 0.783086 7.90255 0.899419 7.74127 1.02617C7.57999 0.899419 7.40976 0.783086 7.23056 0.677172C6.48152 0.234414 5.61959 1.22043e-05 4.73615 1.22043e-05C4.10001 1.22043e-05 3.48357 0.118081 2.90118 0.352482C2.33851 0.578202 1.83138 0.902892 1.39594 1.31613C0.962277 1.72611 0.615857 2.21456 0.376312 2.75379C0.127229 3.31462 0 3.91017 0 4.52309C0 5.10128 0.121853 5.70378 0.363768 6.31669C0.56626 6.82891 0.856557 7.36021 1.22749 7.89673C1.81526 8.74579 2.62343 9.6313 3.62693 10.529C5.28987 12.017 6.93668 13.0449 7.00657 13.0866L7.43126 13.3505C7.61942 13.4668 7.86133 13.4668 8.04949 13.3505L8.47418 13.0866C8.54407 13.0431 10.1891 12.017 11.8538 10.529C12.8573 9.6313 13.6655 8.74579 14.2533 7.89673C14.6242 7.36021 14.9163 6.82891 15.117 6.31669C15.3589 5.70378 15.4808 5.10128 15.4808 4.52309C15.4825 3.91017 15.3553 3.31462 15.1062 2.75379Z"
                                    fill="#AAAAAA"
                                  />
                                </svg>
                                {card.like}
                              </span>
                            </div> */}
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
              <div className="col-md-12">
                <h4 className="no_data_text text-muted">No NFTs Available</h4>
              </div>
            )}
          </div>
          {allNFTs[0]?.length >= 12 ? (
            <div className='row'>
              <div className='col-md-12 text-center mt-5'>
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
