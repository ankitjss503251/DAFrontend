import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import AuthorListing from "../components/AuthorListing";
import DownloadSVG from "../SVG/DownloadSVG";
import OffermadeSVG from "../SVG/OffermadeSVG";
import { Link, NavLink } from "react-router-dom";
import { AuthorCard } from "../../Data/dummyJSON";
import Threegrid from "../SVG/Threegrid";
import Twogrid from "../SVG/Twogrid";
import { useParams } from "react-router-dom";
import {
  GetIndividualAuthorDetail,
  getOnSaleItems,
  GetOwnedNftList,
  getProfile,
} from "../../apiServices";
import moment from "moment";
import coverImg from "./../../assets/images/authorbg.jpg";
import arrow from "./../../assets/images/ep_arrow-right-bold.png";
import UpArrow from "../SVG/dropdown";
import { getCategory } from "../../helpers/getterFunctions";
import BGImg from "../../assets/images/background.jpg";
import CollectionsNFT from "../components/Skeleton/CollectionsNFT";
import GeneralOffer from '../components/GeneralOffer'

function MyNFTs() {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [totalOwned, setTotalOwned] = useState(0);
  const [category, setCategory] = useState([]);
  const [togglemode, setTogglemode] = useState("filterhide");
  const [loader, setLoader] = useState(false);
  const [cardCount, setCardCount] = useState(1);
  const [searchFor, setSearchFor] = useState("");
  const [onSaleNFTs, setOnSaleNFTs] = useState([]);
  const [priceSort, setPriceSort] = useState('ASC');
  const [ERCType, setERCType] = useState();
  const [currPage, setCurrPage] = useState(1);
  const [onSaleCount, setOnSaleCount] = useState(0);

  const bgImage = {
    backgroundImage: `url(${coverImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

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
      let user = await getProfile();
      console.log("_id", id)
      let _profile = await GetIndividualAuthorDetail({ userID: user?.data?._id });
      setProfile(_profile);
      try {
        let reqBody = {
          page: currPage,
          limit: 12,
          userWalletAddress: _profile?.walletAddress?.toLowerCase(),
          searchType: "owned",
          searchText: searchFor,
          priceSort: priceSort,
          ERCType: ERCType
        };
        let _owned = await GetOwnedNftList(reqBody);
        setCardCount(cardCount + _owned.count);
        setTotalOwned(_owned.count);
        if (_owned && _owned.results.length > 0){
          console.log("owned nft is------>",_owned.results)
          setOwnedNFTs(_owned.results);
        }
         
        setLoader(false);
      } catch (e) {
        console.log("Error in fetching owned nfts", e);
      }

      try {
        let reqBody = {
          page: 1,
          limit: 12,
          userWalletAddress: _profile?.walletAddress?.toLowerCase(),
        };
        const onsale = await getOnSaleItems(reqBody);
        setOnSaleCount(onsale?.length);
        setOnSaleNFTs(onsale);
      } catch (e) {
        console.log("Error in fetching onSale Items", e);
      }
    };
    fetch();
  }, [id, searchFor,  ERCType, priceSort]);

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

  return (
    <div style={bgImgStyle}>
      <section
        className='collection_banner pdd_8 d-flex align-items-center justify-content-center'
        style={bgImage}></section>
      <section className='collection_info'>
        <div className='container'>
          <div className='row align-items-end martop-100'>
            <div className='col-md-4'></div>
            <div className='col-md-4 d-flex justify-content-center'>
              <div className='auther_pick'>
                <img
                  alt=''
                  src={
                    profile?.profileIcon
                      ? profile?.profileIcon
                      : "../img/author/icon5.svg"
                  }
                  className='img-fluid collection_profile'
                />
                {/* <div className="overlat_btn">
                  <button type="" className="img_edit_btn">
                    <i className="fa fa-edit fa-lg"></i>
                  </button>
                </div> */}
              </div>
            </div>
            {/* <div className='col-md-4 d-flex justify-content-end'>
              <div className='follow_btns'>
                <button type='button' className='white_btn mr10'>
                  5.2k Followers
                </button>
                <button type='button' className='yellow_btn'>
                  5.2k Following
                </button>
              </div>
            </div> */}
          </div>
          {/* <div className="collection_pick">
            <img alt='' src={'../img/author/user-img.png'} className="img-fluid collection_profile" />
            <div className="overlat_btn"><button type="" className="img_edit_btn"><i className='fa fa-edit fa-lg'></i></button></div>
          </div> */}

          <h1 className='collection_title text-center'>
            {profile?.username ? profile?.username : "John Doe"}{" "}
            <img alt='' src={"../img/author/check.png"} className='img-fluid' />
          </h1>

          <div className='coppycode text-center mb-4'>
            <span className='d-inline-flex align-items-center'>
              <svg
                className='copysvg'
                width='13'
                height='20'
                viewBox='0 0 13 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M6.14228 0L6.27637 0.455737V13.6802L6.14228 13.814L0.00364971 10.1855L6.14228 0Z'
                  fill='#8C8C8C'
                />
                <path
                  d='M6.14213 0L12.2808 10.1855L6.14213 13.8141V7.39532V0Z'
                  fill='#8C8C8C'
                />
                <path
                  d='M6.14222 14.9763L6.21777 15.0684V19.7793L6.14222 20L-6.29425e-05 11.3496L6.14222 14.9763Z'
                  fill='#8C8C8C'
                />
                <path
                  d='M6.14213 19.9997V14.9761L12.2808 11.3494L6.14213 19.9997Z'
                  fill='#8C8C8C'
                />
                <path
                  d='M6.14209 13.8139L0.00355101 10.1854L6.14209 7.39526V13.8139Z'
                  fill='#8C8C8C'
                />
                <path
                  d='M12.2808 10.1854L6.14222 13.8139V7.39526L12.2808 10.1854Z'
                  fill='#8C8C8C'
                />
              </svg>
              {profile?.walletAddress
                ? profile?.walletAddress?.slice(0, 4) +
                  "..." +
                  profile?.walletAddress?.slice(38, 42)
                : "-"}
            </span>
          </div>
          <div className='user_description text-center mb-5'>
            <p>{profile?.bio}</p>
            <h6>Joined {moment(profile?.createdOn).format("MMMM YYYY")}</h6>
          </div>

          <ul className='author_cart nav' role='tablist'>
            <li>
              <button
                data-bs-toggle='pill'
                data-bs-target='#pills-Owned'
                type='button'
                role='tab'
                aria-controls='pills-Owned'
                aria-selected='true'
                className='active'>
                <img
                  alt=''
                  src={"../img/author/icon1.svg"}
                  className='img-fluid'
                />{" "}
                Owned ({totalOwned})
              </button>
            </li>
            <li>
              <button
                data-bs-toggle='pill'
                data-bs-target='#pills-Sale'
                type='button'
                role='tab'
                aria-controls='pills-Sale'
                aria-selected='true'>
                On Sale ({onSaleCount})
              </button>
            </li>
            <li>
              <button
                data-bs-toggle='pill'
                data-bs-target='#pills-Favourited'
                type='button'
                role='tab'
                aria-controls='pills-Favourited'
                aria-selected='true'>
                <img
                  alt=''
                  src={"../img/author/icon3.svg"}
                  className='img-fluid'
                />{" "}
                Favourite
              </button>
            </li>
            <li>
              <button
                data-bs-toggle='pill'
                data-bs-target='#pills-Activity'
                type='button'
                role='tab'
                aria-controls='pills-Activity'
                aria-selected='true'>
                <img
                  alt=''
                  src={"../img/author/icon4.svg"}
                  className='img-fluid'
                />{" "}
                Activity
              </button>
            </li>
            <li>
              <button
                type='button'
                className='dropdown-toggle'
                to={""}
                role='button'
                id='dropdownMenuLink'
                data-bs-toggle='dropdown'
                aria-expanded='false'>
                Offers
              </button>
              <ul className='dropdown-menu Autherpagetab' aria-labelledby='dropdownMenuLink'>
                <li>
                <button
                  data-bs-toggle='pill'
                  data-bs-target='#pills-NFToffer'
                  type='button'
                  role='tab'
                  aria-controls='pills-NFToffer'
                  aria-selected='true'>
                  <DownloadSVG /> Offer Received
                </button>
                </li>
                <li>
                  <button
                    data-bs-toggle='pill'
                    data-bs-target='#pills-NFTmade'
                    type='button'
                    role='tab'
                    aria-controls='pills-NFTmade'
                    aria-selected='true'>
                    <OffermadeSVG /> Offer Made
                  </button>
                </li>
              </ul>
            </li>
          </ul>

          <div className='row'>
            <div className='col-lg-12'>
              <div className='market_search_form mb-5'>
                <form className='d-flex marketplace_form'>
                  <input
                    className=' me-2'
                    type='search'
                    placeholder='Search item here...'
                    aria-label='Search'
                    value={searchFor}
                    onChange={(e) => {
                      setOwnedNFTs([]);
                      setSearchFor(e.target.value);
                      setCardCount(1);
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
                  onChange={(e) => {
                    setOwnedNFTs([]);
                    setOnSaleNFTs([]);
                    setCurrPage(1);
                    setCardCount(0);
                    setERCType(parseInt(e.target.value));
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
                    setOwnedNFTs([]);
                    setOnSaleNFTs([]);
                    setCurrPage(1);
                    setCardCount(0);
                    setPriceSort(e.target.value);
                  }}
                  >
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
                {/* <button
                  type="button"
                  className="filter_btn"
                  onClick={filterToggle}
                >
                  Adv.Filter
                </button> */}
              </div>
            </div>
            <div className={`filter mb-5 ${togglemode}`}>
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
                    type="button"
                    className="drop_down_tlt"
                    data-bs-toggle="collapse"
                    data-bs-target="#demo2"
                  >
                    Price <UpArrow />
                  </button> */}
                  {/* <div id="demo2" className="collapse show">
                    <ul className="status_ul">
                      <li>
                        <select
                          className="form-select filter_apply filter-text-left"
                          aria-label="Default select example"
                        >
                          <option selected>$ Australian Dollar (AUD)</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                      </li>
                      <li>
                        <div className="range_input">
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Min"
                          />
                          <span className="span_class">to</span>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Max"
                          />
                        </div>
                      </li>
                      <li>
                        <button type="submit" className="filter_apply">
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
                    className='drop_down_tlt'
                    data-bs-toggle='collapse'
                    data-bs-target='#demo3'>
                    Collections <UpArrow />
                  </button>
                  <div id='demo3' className='collapse show'>
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
                          <input type='radio' id='allnfts' name='radio-group' />
                          <label htmlFor='allnfts'>All NFTs</label>
                        </div>
                        {category
                          ? category.map((c, key) => {
                              return (
                                <div className='form-check form-check-inline' key={key}>
                                  <input
                                    type='radio'
                                    id={c.name}
                                    name='radio-group'
                                    key={c}
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
                        <div className='form-check form-check-inline'>
                          <input type='radio' id='test1' name='radio-group' />
                          <label htmlFor='test1'>Apple</label>
                        </div>
                        <div className='form-check form-check-inline'>
                          <input type='radio' id='test2' name='radio-group' />
                          <label htmlFor='test2'>Apple</label>
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
          <div className='tab-content' id='pills-tabContent'>
            <div
              className='tab-pane fade show active'
              id='pills-Owned'
              role='tabpanel'
              aria-labelledby='pills-Owned-tab'>
              <div className='row'>
                {loader ? (
                  <CollectionsNFT cards={cardCount} grid={grid} />
                ) : (
                 ownedNFTs?.length > 0 ? ownedNFTs?.map((card, key) => (
                    <div className={grid} key={key}>
                      <AuthorListing
                        image={card.image}
                        fileType={card.fileType}
                        card={card}
                        link={`/nftDetails/${card._id}`}
                      />
                    </div>
                  )) : (
                    <div className="col-md-12">
            <h4 className="no_data_text text-muted">No NFTs Available</h4>
          </div>
                  )
                )}
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-Sale'
              role='tabpanel'
              aria-labelledby='pills-Sale-tab'>
              <div className='row'>
                {loader ? (
                  <CollectionsNFT cards={cardCount} grid={grid} />
                ) : (
                  onSaleNFTs?.map((card, key) => {
                    return (
                      <div className={grid} key={key}>
                        <AuthorListing
                          image={card.image}
                          fileType={card.fileType}
                          card={card}
                          link={`/nftDetails/${card._id}`}
                          bttn={card.OrderData[0].salesType}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-Favourited'
              role='tabpanel'
              aria-labelledby='pills-Favourited-tab'>
              <div className='row'>
                {AuthorCard.map((card, key) => (
                  <div className={grid} key={key}>
                    <AuthorListing
                      image={card.img}
                      submenu={card.Subheading}
                      heading={card.Heading}
                      price={card.price}
                      date={card.Date}
                      button={card.Slug}
                      link={card.Like}
                      fileType={card.fileType}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-Activity'
              role='tabpanel'
              aria-labelledby='pills-Activity-tab'>
              <div className='row'>
                {AuthorCard.map((card, key) => (
                  <div className={grid} key={key}>
                    <AuthorListing
                      image={card.img}
                      submenu={card.Subheading}
                      heading={card.Heading}
                      price={card.price}
                      date={card.Date}
                      button={card.Slug}
                      link={card.Like}
                      fileType={card.fileType}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-NFToffer'
              role='tabpanel'
              aria-labelledby='pills-NFToffer-tab'>
              <div className='row'>
                <div className="col-md-12 mb-5">
                  <h3 className="title_36 mb-4">Offers Received</h3>
                  <GeneralOffer />
                </div>
              </div>
            </div>
            <div
              className='tab-pane fade'
              id='pills-NFTmade'
              role='tabpanel'
              aria-labelledby='pills-NFTmade-tab'>
              <div className='row'>
                <div className="col-md-12 mb-5">
                  <h3 className="title_36 mb-4">Offers Made</h3>
                  <GeneralOffer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default MyNFTs;
