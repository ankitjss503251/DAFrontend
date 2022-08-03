import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/footer";
import CollectionList from "../components/CollectionList";
import ItemSVG from "../SVG/ItemSVG";
import ActivitySVG from "../SVG/ActivitySVG";
import { Link, NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { NotificationManager } from "react-notifications";
import Threegrid from "../SVG/Threegrid";
import Twogrid from "../SVG/Twogrid";
import { useParams } from "react-router-dom";
import {
  getCollections,
  getNFTs,
  getCategory,
  getPrice,
  fetchHistory,
} from "../../helpers/getterFunctions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import arrow from "./../../assets/images/ep_arrow-right-bold.png";
import BGImg from "../../assets/images/background.jpg";
import { convertToEth } from "../../helpers/numberFormatter";
import CollectionsNFT from "../components/Skeleton/CollectionsNFT";
import { Tokens } from "../../helpers/tokensToSymbol";
import moment from "moment";

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
  const [togglemode, setTogglemode] = useState("filterhide");
  const [currPage, setCurrPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [cardCount, setCardCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [searchFor, setSearchFor] = useState("");
  const { id, searchedText } = useParams();
  const [salesType, setSalesType] = useState(-2);
  const [priceSort, setPriceSort] = useState("ASC");
  const [history, setHistory] = useState([]);
  const [historyLoadMore, setHistoryLoadMore] = useState(false);
  const [currHistoryPage, setCurrHistoryPage] = useState(1)

  useEffect(() => {
    const fetch = async () => {
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
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
  }, [currentUser]);

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


  useEffect(() => {
    const fetch = async () => {
      setLoader(true);
      let temp = nftList;
      try {
        const reqData = {
          page: 1,
          limit: 1,
          collectionID: id,
          searchText: searchedText ? searchedText : "",
        };
        const res = await getCollections(reqData);
        setCollectionDetails(res[0]);

        const data = {
          page: currPage,
          limit: 12,
          collectionID: id,
          searchText: searchFor,
          salesType: salesType >= 0 ? Number(salesType) : "",
          priceSort: priceSort,
        };
        const nfts = await getNFTs(data);
        setCardCount(cardCount + nfts.length);
        if (nfts.length > 0) {
          setLoadMoreDisabled("");
          for (let i = 0; i < nfts.length; i++) {
            const order = await getPrice(nfts[i].orderData);
            nfts[i] = {
              ...nfts[i],
              price:
                order?.price?.$numberDecimal === undefined
                  ? "--"
                  : Number(convertToEth(order?.price?.$numberDecimal))
                    .toFixed(6)
                    .slice(0, -2),
              saleType: order?.salesType,
              collectionName: res[0].name,
              paymentToken: order?.paymentToken,
            };
          }
          temp = [...temp, ...nfts];
          setNftList(temp);
        }
        if (nftList && nfts.length <= 0) {
          setLoader(false);
          setLoadMoreDisabled("disabled");
          return;
        }
      } catch (e) {
        console.log("Error in fetching all collections list", e);
      }
      setLoader(false);
    };
    fetch();
  }, [loadMore, searchFor, salesType, priceSort]);


  useEffect(() => {
    const fetch = async () => {
      try {
        const reqData = {
          page: currHistoryPage,
          limit: 12,
          collectionID: id
        }
        const _h = await fetchHistory(reqData);
        setHistory(_h);
      }
      catch (e) {
        console.log(e);
      }
    }
    fetch();
  }, [currHistoryPage])

  return (
    <>
      <div style={bgImgStyle}>
        {loadMoreDisabled && !nftList
          ? NotificationManager.info("No more items to load")
          : ""}
        <section
          className="collection_banner pdd_8"
          style={{
            backgroundImage: `url(${collectionDetails?.coverImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></section>
        <section className="collection_info">
          <div className="container">
            <div className="collection_pick">
              <img
                alt=""
                src={collectionDetails?.brand?.logoImage}
                class="img-fluid collection_profile"
                onError={(e) => {
                  e.target.src =
                    "../img/collections/list4.png";
                }}
              />
              {/* <img
              alt=''
              src={"../img/collections/check.png"}
              class='img-fluid check_img'
            /> */}
            </div>
            <h1 className="collection_title text-center">
              {collectionDetails?.name}
            </h1>
            <ul class="collection_social mb-4">
              <li>
                <a href={"/"}>
                  <i class="fa fa-facebook fa-lg"></i>
                </a>
              </li>
              <li>
                <a href={"/"}>
                  <i class="fa fa-twitter fa-lg"></i>
                </a>
              </li>
              <li>
                <a href={"/"}>
                  <i class="fa fa-linkedin fa-lg"></i>
                </a>
              </li>
              <li>
                <a href={"/"}>
                  <i class="fa fa-pinterest fa-lg"></i>
                </a>
              </li>
            </ul>

            <div className="coppycode text-center">
              <span className="ctc">
                <img alt="" src={"../img/favicon.png"} class="img-fluid" />
                <div className="">
                  {collectionDetails?.contractAddress
                    ? collectionDetails?.contractAddress?.slice(0, 4) +
                    "..." +
                    collectionDetails?.contractAddress?.slice(38, 42)
                    : "-"}
                </div>

                <CopyToClipboard
                  text={collectionDetails?.contractAddress}
                  onCopy={() => {
                    console.log("copied!!!");
                    setIsCopied(true);
                    setTimeout(() => {
                      setIsCopied(false);
                    }, 1000);
                  }}
                >
                  <svg
                    width="21"
                    height="24"
                    viewBox="0 0 21 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 21V22.875C15 23.4963 14.4963 24 13.875 24H1.125C0.503672 24 0 23.4963 0 22.875V5.625C0 5.00367 0.503672 4.5 1.125 4.5H4.5V18.375C4.5 19.8225 5.67755 21 7.125 21H15ZM15 4.875V0H7.125C6.50367 0 6 0.503672 6 1.125V18.375C6 18.9963 6.50367 19.5 7.125 19.5H19.875C20.4963 19.5 21 18.9963 21 18.375V6H16.125C15.5063 6 15 5.49375 15 4.875ZM20.6705 3.42052L17.5795 0.329484C17.3685 0.11852 17.0824 1.55998e-06 16.784 0L16.5 0V4.5H21V4.21598C21 3.91763 20.8815 3.63149 20.6705 3.42052Z"
                      fill="#fff"
                    />
                  </svg>
                </CopyToClipboard>
                {isCopied ? <p className="copied">Copied!</p> : ""}
              </span>
            </div>
            <ul className="collection_status mt-5 mb-5">
              <li>
                <h4>
                  {nftList[0]?.count
                    ? nftList[0]?.count
                    : "0"}
                </h4>
                <p>items</p>
              </li>
              <li>
                <h4>
                  {collectionDetails?.owners ? collectionDetails.owners : "-"}
                </h4>
                <p>owners</p>
              </li>
              <li>
                <h4>
                  {collectionDetails?.price
                    ? Number(convertToEth(collectionDetails.price))
                    : "-"}
                </h4>
                <p>floor price</p>
              </li>
              <li>
                <h4>
                  {collectionDetails?.volumeTraded
                    ? collectionDetails.volumeTraded
                    : "-"}
                </h4>
                <p>volume traded</p>
              </li>
            </ul>
            <div className="collection_description text-center">
              <p>{collectionDetails?.desc}</p>
              <span className="top_arrow">
                <img alt="" src={"../img/top_arrow.png"} class="img-fluid" />
              </span>
            </div>

            <div className="row ">
              <div className="col-md-12 text-center item_active">
                <ul className="author_cart nav" role="tablist">
                  <li classname="item_active">
                    <a
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Items"
                      role="tab"
                      aria-controls="pills-Items"
                      aria-selected="true"
                      className="active"
                    >
                      <span className="mr-3">
                        <ItemSVG />
                      </span>{" "}
                      Items
                    </a>
                  </li>
                  <li classname="item_active">
                    <a
                      data-bs-toggle="pill"
                      data-bs-target="#pills-Activity"
                      role="tab"
                      aria-controls="pills-Activity"
                      aria-selected="true"
                    >
                      <span className="mr-3">
                        <ActivitySVG />
                      </span>{" "}
                      Activity
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="collection_list mb-5 pb-5">
          <div className="container">
            <div className="tab-content tab-padd" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-Items"
                role="tabpanel"
                aria-labelledby="pills-Items-tab"
              >

                <div className="row">
                  <div className="col-lg-12">
                    <div className="market_search_form mb-4">
                      <form class="d-flex marketplace_form">
                        <input
                          class=" me-2"
                          type="search"
                          placeholder="Search item here..."
                          aria-label="Search"
                          value={searchFor}
                          onChange={(e) => {
                            setNftList([]);
                            setCurrPage(1);
                            setCardCount(0);
                            setSearchFor(e.target.value);
                            setLoadMoreDisabled("");
                          }}
                        />
                        <button class="market_btn" type="button">
                          <img src="../img/search.svg" alt="" />
                        </button>
                      </form>
                      <select
                        class="market_select_form form-select"
                        aria-label="Default select example"
                        style={bgImgarrow}
                        onChange={(e) => {
                          setNftList([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setLoadMoreDisabled("");
                          setSalesType(e.target.value)
                        }}
                      >
                        <option value='-2' selected>
                          All Sales Type
                        </option>
                        <option value='0'>Buy Now</option>
                        <option value='1'>On Auction</option>
                        <option value='2'>Not for Sale</option>
                      </select>
                      <select
                        class="market_select_form form-select"
                        aria-label="Default select example"
                        style={bgImgarrow}
                        onChange={(e) => {
                          setNftList([]);
                          setCurrPage(1);
                          setCardCount(0);
                          setLoadMoreDisabled("");
                          setPriceSort(e.target.value);
                        }}
                      >
                        <option value='ASC' defaultValue>
                          Price: Low to High
                        </option>
                        <option value='DESC'>Price: High to Low</option>
                      </select>
                      {/* <div className="market_div"> */}

                      <div
                        id="gridtwo"
                        className="market_grid"
                        onClick={gridtwo}
                      >
                        <Twogrid />
                      </div>
                      <div
                        id="gridthree"
                        className="market_grid"
                        onClick={gridthree}
                      >
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

                <div className="row">
                  {nftList.length > 0 ? (
                    nftList?.map((n, k) => {
                      return (
                        <div className={grid} key={k}>
                          <CollectionList nft={n} />
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-md-12">
                      <h4 className="no_data_text text-muted">No NFTs Available</h4>
                    </div>
                  )}

                  {nftList.length > 12 ? (
                    <div class="col-md-12 text-center mt-5">
                      <button
                        class={`btn view_all_bdr ${loadMoreDisabled}`}
                        onClick={() => {
                          setCurrPage(currPage + 1);
                          setLoadMore(!loadMore);
                        }}
                      >
                        Load More
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-Activity"
                role="tabpanel"
                aria-labelledby="pills-Activity-tab"
              >
                <div className="row">
                  <div className="col-md-6 d-md-inline-flex">
                    <select
                      class="action_select_form form-select mr-3"
                      aria-label="Default select example"
                      style={bgImgarrow}
                    >
                      <option selected>Listings</option>
                      <option value="1">Listings Items 1</option>
                      <option value="2">Listings Items 2</option>
                      <option value="3">Listings Items 3</option>
                    </select>
                    <select
                      class="action_select_form form-select"
                      aria-label="Default select example"
                      style={bgImgarrow}
                    >
                      <option selected>Hunter Token</option>
                      <option value="1">Hunter Token 1</option>
                      <option value="2">Hunter Token 2</option>
                      <option value="3">Hunter Token 3</option>
                    </select>
                  </div>
                  <div className="col-md-6 d-flex justify-content-end">
                    <select
                      class="action_select_form form-select"
                      aria-label="Default select example"
                      style={bgImgarrow}
                    >
                      <option selected>Last 90 Days</option>
                      <option value="1">Last 40 Days</option>
                      <option value="2">Last 30 Days</option>
                      <option value="3">Last 10 Days</option>
                    </select>
                  </div>
                </div>
                <section className="collectionAction mb-5 pb-5 mt-5">
                  <div className="row">
                    <div className="col-md-12">
                      <img
                        alt=""
                        src={"../img/collections/graph.png"}
                        class="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-12">
                      <div class="table-responsive">
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
                                          class="img-fluid"
                                        />{" "}
                                        {h.action}
                                      </td>
                                      <td className="d-flex justify-content-around align-items-center">
                                        <div className="hist_nft_img">
                                          <img
                                            alt=""
                                            src={h.nftImg}
                                            class="img-fluid"
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
                    <div class="col-md-12 text-center ">
                      <a class="view_all_bdr" href="/" disabled={historyLoadMore ? "disabled" : ""} onClick={() => {
                        setCurrHistoryPage(currHistoryPage + 1);
                      }}>
                        Load More
                      </a>
                    </div>
                  </div>}
                </section>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default Collection;
