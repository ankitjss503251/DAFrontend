import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/footer";
import { getCategory, getCategoryWithCollectionData, getCollections } from "../../helpers/getterFunctions";
import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import BGImg from "./../../assets/images/background.jpg";
import MarketplaceBGIamge from "../../assets/marketplace-bg.jpg";
import CollectionSkeletonCard from "../components/Skeleton/CollectionSkeletonCard";
import { Link } from "@reach/router";

function Marketplacecollection() {
  var register_bg = {
    backgroundImage: `url(${MarketplaceBGIamge})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  };
  var bgImgStyle = {
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

  const [allCollections, setAllCollections] = useState([]);
  const [listCount, setListCount] = useState(3);
  const [recordCount, setRecordCount] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [loadMoreDisabledAll, setLoadMoreDisabledAll] = useState("");
  const [categories, setCategories] = useState([]);
  const [allActiveTab, setAllActiveTab] = useState("active");
  const [allActive, setAllActive] = useState("show active");
  const { searchedText } = useParams();
  const [loader, setLoader] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [allColData, setAllColData] = useState(1);

  const [isPageChange, setIsPageChange] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(1);
  const [selectedCat, setSelectedCat] = useState("All");

  const allTabref = useRef(null);
  const allTabDataref = useRef(null);

  // useEffect(() => {
  //   resetTablsAtive();
  // }, [currPage, selectedCat]);

  useEffect(() => {
    const fetch = async () => {
      setLoader(true);
      try {
        const res1 = await getCategory();
        setCategories(res1);
        resetTablsAtive();
      } catch (e) {
        console.log("Error in fetching all collections list", e);
      }
      setLoader(false);
    };
    fetch();
  }, [currPage, selectedCat, searchedText]);

  function onTabBarClick(tab_ID = "") {
    setCurrPage(1);
    setSelectedCat(tab_ID);
    setIsSearchActive(0);
    setAllCollections([]);
    setIsPageChange(0);
  }

  async function resetTablsAtive() {
    let catID = selectedCat;
    let isSearch = isSearchActive;
    let isPage = isPageChange;
    console.log("currPage TOP", currPage);
    let isanyActive = 0;
    if (searchedText === undefined && isSearch === 1) {
      setAllActiveTab("active");
      setAllActive("show active");
    }
    let reqData = {};
    reqData = {
      page: currPage,
      limit: listCount,
      isOnMarketplace: 1,
    };
    if (catID !== "All" && catID !== "" && searchedText === undefined) {
      console.log("Here")
      reqData.categoryID = catID;
      if (allTabref?.current?.classList?.contains('active')) {
        allTabref?.current?.classList?.remove('active')
      }
      if (allTabDataref?.current?.classList?.contains('show')) {
        allTabDataref?.current?.classList?.remove('show')
      }
      if (allTabDataref?.current?.classList?.contains('active')) {
        allTabDataref?.current?.classList?.remove('active')
      }
    }
    const res1 = await getCategory();
    if (res1.length > 0) {
      for (const myCat of res1) {
        myCat.loadmore = "";
        myCat.isActiveTab = "";
        myCat.isActive = "";
        if (isSearch === 0) {
          if (catID === myCat._id && isanyActive === 0) {
            console.log("Active cat", myCat.name)
            reqData.categoryID = myCat._id;
            myCat.isActiveTab = "active";
            myCat.isActive = "show active";
            setAllActiveTab("");
            setAllActive("");
            isanyActive = 1;
          }
        } else {
          if (searchedText === myCat.name && isanyActive === 0) {
            console.log("Active cat", myCat.name)
            reqData.categoryID = myCat._id;
            myCat.isActiveTab = "active";
            myCat.isActive = "show active";
            setAllActiveTab("");
            setAllActive("");
            isanyActive = 1;
          }
        }
      }
    }
    console.log("reqdata", reqData);
    setCategories(res1);
    const res = await getCollections(reqData);
    console.log("res", res);
    setRecordCount(res[0]?.count)
    setCardCount(res.length);
    setLoadMoreDisabledAll("");
    if (isPage === 0) {
      console.log("isPage statment")
      setAllCollections(Object.assign([], [res]))
    } else {
      console.log("allColData", allCollections);
      let temp = [...allCollections[0], ...res];
      setAllCollections([temp])
    }
    // setAllCollections(allColData);
  }
  console.log("allCollections", loader, allCollections);
  return (
    <div>
      <section className="register_hd pdd_12" style={register_bg}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>Collections</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="marketplace-tab pdd_8" style={bgImgStyle}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="tab_btn mb-5 nav nav-pills1" id="pills-tab" role="tablist">
                {categories?.length > 0 ?
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${allActiveTab}`} ref={allTabref} onClick={() => { onTabBarClick("All") }} id="pills-allNFTs-tab" data-bs-toggle="pill" data-bs-target="#pills-allNFTs" type="button" role="tab" aria-controls="pills-allNFTs" aria-selected="true">All</button>
                  </li>
                  : ""}
                {categories?.length > 0
                  ? categories.map((cat, key) => {
                    return (
                      <li className="nav-item" role="presentation">
                        <button className={`nav-link ${cat?.isActiveTab}`} onClick={() => { onTabBarClick(`${cat._id}`) }} id={`pills-${cat._id}-tab`} data-bs-toggle="pill" data-bs-target={`#pills-${cat._id}`} type="button" role="tab" aria-controls={`pills-${cat._id}`} aria-selected="true">{cat.name}</button>
                      </li>
                    );
                  }) : ""}
              </ul>
            </div>
          </div>
          <div className="tab-content" id="pills-tabContent">
            {categories?.length > 0 ?
              <div className={`tab-pane fade active show`} id="pills-allNFTs11" role="tabpanel" aria-labelledby="pills-allNFTs11-tab">
                <div className="row">
                  {loader ? (
                    <CollectionSkeletonCard cards={cardCount} />
                  ) : allCollections?.length > 0 ? (
                    allCollections.map((oIndex) => {

                      return oIndex.map((card, key) => (
                        <div className="col-lg-4 col-md-6 mb-5" key={card.id}>
                          <div className="collection_slide">
                            <a href={`/collection/${card?._id}`}>
                              <div className="mint_img">
                                <img
                                  className="img-fluid w-100"
                                  src={card?.coverImg}
                                  onError={(e) => {
                                    e.target.src = "../img/collections/list4.png";
                                  }}
                                  alt=""
                                />
                              </div>
                            </a>
                            <div className="collection_text">
                              <div className="coll_profileimg">
                                <div className="rotater_border profile_img">
                                  <a
                                    className="rounded-circle"
                                    href={`/collectionwithcollection/${card?.brand?._id}`}
                                  >
                                    <img
                                      alt=""
                                      className=""
                                      src={card.brand?.logoImage}
                                      onError={(e) => {
                                        e.target.src =
                                          "../img/collections/list4.png";
                                      }}
                                    />
                                  </a>
                                </div>
                              </div>

                              <h4 className="collname">
                                {card.name?.length > 15
                                  ? card.name?.slice(0, 15)
                                  : card.name}
                              </h4>
                              <p>
                                {card.desc?.length > 15
                                  ? card.desc?.slice(0, 15) + "..."
                                  : card.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ));
                    })
                  ) : (
                    <div className="col-md-12">
                      <h4 className="no_data_text text-muted">No Collections Available</h4>
                    </div>
                  )}
                  {recordCount > listCount ? (
                    <div className="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                      <button
                        type="button"
                        className={`btn view_all_bdr ${loadMoreDisabledAll}`}
                        onClick={() => {
                          setCurrPage(currPage + 1);
                          setIsPageChange(1);
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
              : ""}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplacecollection;
