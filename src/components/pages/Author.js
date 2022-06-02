import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
// import Relatedcollection from '../components/Relatedcollection';
import AuthorListing from "../components/AuthorListing";
import DownloadSVG from "../SVG/DownloadSVG";
import OffermadeSVG from "../SVG/OffermadeSVG";
import { Link, NavLink } from "react-router-dom";
import { AuthorCard } from "../../Data/dummyJSON";
import Threegrid from "../SVG/Threegrid";
import Twogrid from "../SVG/Twogrid";
import { useParams } from "react-router-dom";
import { GetIndividualAuthorDetail, GetOwnedNftList } from "../../apiServices";

const bgImgStyle = {
  backgroundImage: "url(./img/background.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPositionX: "center",
  backgroundPositionY: "center",
  backgroundColor: "#000",
};

const bgImage = {
  backgroundImage: "url(./img/author/authorbg.jpg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};
var bgImgarrow = {
  backgroundImage: "url(./img/ep_arrow-right-bold.png)",
  backgroundRepeat: "no-repeat",
};

function Author() {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [totalOwned, setTotalOwned] = useState(0);

  useEffect(() => {
    console.log("id", id);
    const fetch = async () => {
      let _profile = await GetIndividualAuthorDetail({ userID: id });
      setProfile(_profile);
      let reqBody = {
        page: 1,
        limit: 12,
        userWalletAddress: _profile.walletAddress,
        searchType: "owned",
      };
      let _owned = await GetOwnedNftList(reqBody);
      setTotalOwned(_owned.count);
      if (_owned && _owned.results.length > 0) setOwnedNFTs(_owned.results[0]);
      console.log("owned nfts", _owned);
      console.log("in user profile api", _profile);
    };
    fetch();
  }, [id]);

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
        className="collection_banner pdd_8 d-flex align-items-center justify-content-center"
        style={bgImage}
      >
        <div className="container d-flex align-items-center justify-content-center">
          <button type="" className="edit_btn">
            <i class="fa fa-edit fa-lg"></i>
          </button>
        </div>
      </section>
      <section className="collection_info">
        <div className="container">
          <div className="row align-items-end martop-100">
            <div className="col-md-4"></div>
            <div className="col-md-4 d-flex justify-content-center">
              <div className="auther_pick">
                <img
                  alt=""
                  src={"../img/author/user-img.png"}
                  class="img-fluid collection_profile"
                />
                <div className="overlat_btn">
                  <button type="" className="img_edit_btn">
                    <i class="fa fa-edit fa-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-end">
              <div className="follow_btns">
                <button type="button" className="white_btn mr10">
                  5.2k Followers
                </button>
                <button type="button" className="yellow_btn">
                  Follow
                </button>
              </div>
            </div>
          </div>
          {/* <div className="collection_pick">
            <img alt='' src={'../img/author/user-img.png'} class="img-fluid collection_profile" />
            <div className="overlat_btn"><button type="" className="img_edit_btn"><i class='fa fa-edit fa-lg'></i></button></div>
          </div> */}

          <h1 className="collection_title text-center">
            {profile?.username ? profile?.username : "-"}
            <img alt="" src={"../img/author/check.png"} class="img-fluid" />
          </h1>

          <div className="coppycode text-center mb-4">
            <span className="d-inline-flex align-items-center">
              <svg
                className="copysvg"
                width="13"
                height="20"
                viewBox="0 0 13 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.14228 0L6.27637 0.455737V13.6802L6.14228 13.814L0.00364971 10.1855L6.14228 0Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M6.14213 0L12.2808 10.1855L6.14213 13.8141V7.39532V0Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M6.14222 14.9763L6.21777 15.0684V19.7793L6.14222 20L-6.29425e-05 11.3496L6.14222 14.9763Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M6.14213 19.9997V14.9761L12.2808 11.3494L6.14213 19.9997Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M6.14209 13.8139L0.00355101 10.1854L6.14209 7.39526V13.8139Z"
                  fill="#8C8C8C"
                />
                <path
                  d="M12.2808 10.1854L6.14222 13.8139V7.39526L12.2808 10.1854Z"
                  fill="#8C8C8C"
                />
              </svg>
              {profile?.walletAddress
                ? profile.walletAddress.slice(0, 4) +
                  "..." +
                  profile.walletAddress.slice(38, 41)
                : "-"}
            </span>
          </div>
          <div className="user_description text-center mb-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iaculis
              egestas a, praesent elit faucibus magnis dignissim. Lorem aliquet
              faucibus metus nibh amet cursus. Lorem suspendisse malesuada
              tortor, faucibus.
            </p>
            <h6>Joined March 2022</h6>
          </div>

          <ul className="auther_cart nav" role="tablist">
            <li>
              <button
                data-bs-toggle="pill"
                data-bs-target="#pills-Owned"
                type="button"
                role="tab"
                aria-controls="pills-Owned"
                aria-selected="true"
                className="active"
              >
                <img alt="" src={"../img/author/icon1.svg"} class="img-fluid" />{" "}
                Owned ({totalOwned})
              </button>
            </li>
            <li>
              <button
                data-bs-toggle="pill"
                data-bs-target="#pills-Sale"
                type="button"
                role="tab"
                aria-controls="pills-Sale"
                aria-selected="true"
              >
                On Sale
              </button>
            </li>
            <li>
              <button
                data-bs-toggle="pill"
                data-bs-target="#pills-Favourited"
                type="button"
                role="tab"
                aria-controls="pills-Favourited"
                aria-selected="true"
              >
                <img alt="" src={"../img/author/icon3.svg"} class="img-fluid" />{" "}
                Favourited 2
              </button>
            </li>
            <li>
              <button
                data-bs-toggle="pill"
                data-bs-target="#pills-Activity"
                type="button"
                role="tab"
                aria-controls="pills-Activity"
                aria-selected="true"
              >
                <img alt="" src={"../img/author/icon4.svg"} class="img-fluid" />{" "}
                Activity
              </button>
            </li>
            <li>
              <button
                type="button"
                class="dropdown-toggle"
                to={""}
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  alt=""
                  src={
                    profile?.profileIcon
                      ? profile?.profileIcon
                      : "../img/author/icon5.svg"
                  }
                  class="img-fluid"
                />{" "}
                Offers
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <NavLink
                    activeclassname="active-link"
                    className="dropdown-item"
                    to={"/"}
                  >
                    <DownloadSVG /> Offer Received
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to={"/"}>
                    <OffermadeSVG /> Offer Made
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>

          <div className="row">
            <div className="col-lg-12">
              <div className="market_search_form mb-5">
                <form class="d-flex marketplace_form">
                  <input
                    class=" me-2"
                    type="search"
                    placeholder="Search item here..."
                    aria-label="Search"
                  />
                  <button class="market_btn" type="submit">
                    <img src="../img/search.svg" alt="" />
                  </button>
                </form>
                <select
                  class="market_select_form form-select"
                  aria-label="Default select example"
                  style={bgImgarrow}
                >
                  <option selected>Single Items</option>
                  <option value="1">Single Items 1</option>
                  <option value="2">Single Items 2</option>
                  <option value="3">Single Items 3</option>
                </select>
                <select
                  class="market_select_form form-select"
                  aria-label="Default select example"
                  style={bgImgarrow}
                >
                  <option selected>Price: Low to High</option>
                  <option value="1">$2000</option>
                  <option value="2">$4000</option>
                  <option value="3">$6000</option>
                </select>
                {/* <div className="market_div"> */}
                <div id="gridtwo" className="market_grid" onClick={gridtwo}>
                  <Twogrid />
                </div>
                <div id="gridthree" className="market_grid" onClick={gridthree}>
                  <Threegrid />
                </div>
                {/* </div> */}
                <button type="button" className="filter_btn">
                  Adv.Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="collection_list mb-5 pb-5">
        <div className="container">
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-Owned"
              role="tabpanel"
              aria-labelledby="pills-Owned-tab"
            >
              <div className="row">
                {ownedNFTs.map((card) => (
                  <div className={grid} key={card.id}>
                    <AuthorListing
                      image={card.image}
                      // submenu={card.Subheading}
                      // heading={card.Heading}
                      // price={card.price}
                      // date={card.Date}
                      // button={card.Slug}
                      link={`/nftDetails/${card._id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Sale"
              role="tabpanel"
              aria-labelledby="pills-Sale-tab"
            >
              <div className="row">
                {AuthorCard.map((card) => (
                  <div className={grid} key={card.id}>
                    <AuthorListing
                      image={card.img}
                      submenu={card.Subheading}
                      heading={card.Heading}
                      price={card.price}
                      date={card.Date}
                      button={card.Slug}
                      link={card.Like}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Favourited"
              role="tabpanel"
              aria-labelledby="pills-Favourited-tab"
            >
              <div className="row">
                {AuthorCard.map((card) => (
                  <div className={grid} key={card.id}>
                    <AuthorListing
                      image={card.img}
                      submenu={card.Subheading}
                      heading={card.Heading}
                      price={card.price}
                      date={card.Date}
                      button={card.Slug}
                      link={card.Like}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-Activity"
              role="tabpanel"
              aria-labelledby="pills-Activity-tab"
            >
              <div className="row">
                {AuthorCard.map((card) => (
                  <div className={grid} key={card.id}>
                    <AuthorListing
                      image={card.img}
                      submenu={card.Subheading}
                      heading={card.Heading}
                      price={card.price}
                      date={card.Date}
                      button={card.Slug}
                      link={card.Like}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Author;
