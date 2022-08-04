import React,{useState,useEffect} from "react";
import Footer from "../components/footer";
import {getCategory,getCollections} from "../../helpers/getterFunctions";
import {useParams} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import BGImg from "./../../assets/images/background.jpg";
import MarketplaceBGIamge from "../../assets/marketplace-bg.jpg";
import CollectionSkeletonCard from "../components/Skeleton/CollectionSkeletonCard";
import {Link} from "@reach/router";

function Marketplacecollection() {
  var register_bg={
    backgroundImage: `url(${MarketplaceBGIamge})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  };
  var bgImgStyle={
    backgroundImage: `url(${BGImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

<<<<<<< HEAD
  const [allCollections,setAllCollections]=useState([]);
  const [currPageAll,setCurrPageAll]=useState(1);
  const [currPage,setCurrPage]=useState(1);
  const [loadMore,setLoadMore]=useState(false);
  const [loadMoreDisabled,setLoadMoreDisabled]=useState("");
  const [loadMoreDisabledAll,setLoadMoreDisabledAll]=useState("");
  const [categories,setCategories]=useState([]);
  const [showTab,setShowTab]=useState("");
  const [activeCat,setActiveCat]=useState([]);
  const {searchedText}=useParams();
  const [loader,setLoader]=useState(false);
  const [cardCount,setCardCount]=useState(0);
  const [daDisabledClass,setDaDisabledClass]=useState()
=======
  const [allCollections, setAllCollections] = useState([]);
  const [currPageAll, setCurrPageAll] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDisabled, setLoadMoreDisabled] = useState("");
  const [loadMoreDisabledAll, setLoadMoreDisabledAll] = useState("");
  const [categories, setCategories] = useState([]);
  const [showTab, setShowTab] = useState("");
  const [allActiveTab, setAllActiveTab] = useState("active");
  const [allActive, setAllActive] = useState("show active");
  const [activeCat, setActiveCat] = useState([]);
  const { searchedText } = useParams();
  const [loader, setLoader] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [daDisabledClass, setDaDisabledClass] = useState()
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b

  useEffect(() => {
    const fetch=async () => {
      setLoader(true);
      try {
<<<<<<< HEAD
        const res1=await getCategory();
        if(res1.length>0) {
          for(const myCat of res1) {
            myCat.CollectionData=[];
            myCat.loadmore="";
            try {
              const reqBody={
=======
        let isanyActive = 0;
        console.log("Search Text", searchedText)
        // if (searchedText === undefined) {
        //   setAllActiveTab("active");
        //   setAllActive("show active");
        // }
        // console.log("isanyActive", isanyActive)
        const res1 = await getCategory();
        if (res1.length > 0) {
          for (const myCat of res1) {
            myCat.CollectionData = [];
            myCat.loadmore = "";
            myCat.isActiveTab = "";
            myCat.isActive = "";
            // if (searchedText === myCat.name && isanyActive === 0) {
            //   console.log("Active cat", myCat.name)
            //   myCat.isActiveTab = "active";
            //   myCat.isActive = "show active";
            //   setAllActiveTab("");
            //   setAllActive("");
            //   isanyActive = 1;
            // }
            try {
              const reqBody = {
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
                page: currPage,
                limit: 12,
                categoryID: myCat._id,
                isOnMarketplace: 1,
              };
<<<<<<< HEAD
              const ind=await getCollections(reqBody);
              myCat.CollectionData=ind;
              if(ind.length>0) {
                myCat.loadmore="";
              } else {
                myCat.loadmore="Disable";
              }
            } catch(e) {
              console.log("Error",e);
            }
          }
        }
        console.log("Cate Data",res1);
=======
              const ind = await getCollections(reqBody);
              myCat.CollectionData = ind;
              if (ind.length > 0) {
                myCat.loadmore = "";
              } else {
                myCat.loadmore = "Disable";
              }
            } catch (e) {
              console.log("Error", e);
            }
          }
        }
        console.log("Cate Data", res1);
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
        setCategories(res1);
        let t=[];
        res1?.map((r) => {
          t=[...t,r.name];
        });
<<<<<<< HEAD
        if(!t.includes(searchedText)&&!showTab) {
          let temp=allCollections;
          const reqData={
            page: currPageAll,
            limit: 12,
            searchText: searchedText? searchedText:"",
            isOnMarketplace: 1,
          };
          const res=await getCollections(reqData);
          setCardCount(cardCount+res.length);
          if(res.length>0) {
            setLoadMoreDisabledAll("");
            temp=[...temp,res];
            setAllCollections(temp);
          }

          if(allCollections&&res.length<=0) {
            setLoader(false);
            setLoadMoreDisabledAll("disabled");
            return;
          }
        } else {
          setLoader(true);
          try {
            setShowTab("show active");
            if(searchedText) {
              document.getElementById(searchedText).classList.add("active");
            }
            const res1=await getCategory({
              name: searchedText,
            });
            handleCategoryChange(res1[0]);
          } catch(e) {
            console.log("Error",e);
          }
          setLoader(false);
=======
        let temp = [];
        const reqData = {
          page: currPageAll,
          limit: 12,
          searchText: "",
          isOnMarketplace: 1,
        };
        const res = await getCollections(reqData);
        setCardCount(cardCount + res.length);
        if (res.length > 0) {
          setLoadMoreDisabledAll("");
          temp = [...temp, res];
          setAllCollections(temp);
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
        }
      } catch(e) {
        console.log("Error in fetching all collections list",e);
      }
      setLoader(false);
    };
    fetch();
  },[loadMore,searchedText,showTab]);

<<<<<<< HEAD
  const handleCategoryChange=async (category) => {
    setLoader(true);

    setActiveCat([]);
    try {
      let temp2=activeCat;
      const reqBody={
        page: currPage,
        limit: 12,
        categoryID: category._id,
        isOnMarketplace: 1,
      };
      const ind=await getCollections(reqBody);
      console.log("loading catefory")
      setCardCount(cardCount+ind.length);
      if(ind.length>0) {
        setLoadMoreDisabled("");
        //temp2 = [...temp2, ind];
        temp2=[ind];
        setActiveCat(temp2);
      }
      if(ind?.length<=0&&activeCat) {
        setLoader(false);
        setLoadMoreDisabled("disabled");
        return;
      }
    } catch(e) {
      console.log("Error",e);
    }
    setLoader(false);
  };
=======

>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b

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
<<<<<<< HEAD
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="pills-allNFTs-tab" data-bs-toggle="pill" data-bs-target="#pills-allNFTs" type="button" role="tab" aria-controls="pills-allNFTs" aria-selected="true">All</button>
                </li>
                {categories?.length>0
                  ? categories.map((cat,key) => {
                    return (
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" id={`pills-${cat._id}-tab`} data-bs-toggle="pill" data-bs-target={`#pills-${cat._id}`} type="button" role="tab" aria-controls={`pills-${cat._id}`} aria-selected="true">{cat.name}</button>
                      </li>
                    );
                  }):""}
=======
                {categories?.length > 0 ?
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${allActiveTab}`} id="pills-allNFTs-tab" data-bs-toggle="pill" data-bs-target="#pills-allNFTs" type="button" role="tab" aria-controls="pills-allNFTs" aria-selected="true">All</button>
                  </li>
                  : ""}
                {categories?.length > 0
                  ? categories.map((cat, key) => {
                    return (
                      <li className="nav-item" role="presentation">
                        <button className={`nav-link ${cat?.isActiveTab}`} id={`pills-${cat._id}-tab`} data-bs-toggle="pill" data-bs-target={`#pills-${cat._id}`} type="button" role="tab" aria-controls={`pills-${cat._id}`} aria-selected="true">{cat.name}</button>
                      </li>
                    );
                  }) : ""}
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
              </ul>
            </div>
          </div>
          <div className="tab-content" id="pills-tabContent">
<<<<<<< HEAD
            <div className="tab-pane fade show active" id="pills-allNFTs" role="tabpanel" aria-labelledby="pills-allNFTs-tab">
              <div className="row">
                {loader? (
                  <CollectionSkeletonCard cards={cardCount} />
                ):allCollections?.length>0? (
                  allCollections.map((oIndex) => {
                    return oIndex.map((card,key) => (
                      <div className="col-lg-4 col-md-6 mb-5" key={key}>
                        <div className="collection_slide">
                          <a href={`/collection/${card?._id}`}>
                            <div className="mint_img">
                              <img
                                className="img-fluid w-100"
                                src={card?.coverImg}
                                onError={(e) => {
                                  e.target.src="../img/collections/list4.png";
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
                                      e.target.src=
                                        "../img/collections/list4.png";
                                    }}
                                  />
                                </a>
                              </div>
                            </div>

                            <h4 className="collname">
                              {card.name?.length>15
                                ? card.name?.slice(0,15)
                                :card.name}
                            </h4>
                            <p>
                              {card.desc?.length>15
                                ? card.desc?.slice(0,15)+"..."
                                :card.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ));
                  })
                ):(
                  <div className="col-md-12">
                    <h4 className="no_data_text text-muted">No Collections Available</h4>
                  </div>
                )}
                {allCollections[0]?.length>12? (
                  <div className="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                    <button
                      type="button"
                      className={`btn view_all_bdr ${loadMoreDisabledAll}`}
                      onClick={() => {
                        setCurrPageAll(currPageAll+1);
                        setLoadMore(!loadMore);
                      }}
                    >
                      Load More
                    </button>
                  </div>
                ):(
                  ""
                )}
              </div>
            </div>

            {categories?.length>0
              ? categories.map((cat,key) => {
                return (
                  <>
                    <div className="tab-pane fade" id={`pills-${cat._id}`} role="tabpanel" aria-labelledby={`pills-${cat._id}-tab`} key={key}>
                      <div className="row">
                        {cat?.CollectionData?.length>0? cat.CollectionData.map((card,key1) => {
=======
            {categories?.length > 0 ?
              <div className={`tab-pane fade ${allActive}`} id="pills-allNFTs" role="tabpanel" aria-labelledby="pills-allNFTs-tab">
                <div className="row">
                  {loader ? (
                    <CollectionSkeletonCard cards={cardCount} />
                  ) : allCollections?.length > 0 ? (
                    allCollections.map((oIndex) => {
                      return oIndex.map((card, key) => (
                        <div className="col-lg-4 col-md-6 mb-5" key={key}>
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
                  {allCollections[0]?.length > 12 ? (
                    <div className="col-md-12 text-center mt-0 mt-lg-5 mt-xl-5 mt-md-5">
                      <button
                        type="button"
                        className={`btn view_all_bdr ${loadMoreDisabledAll}`}
                        onClick={() => {
                          setCurrPageAll(currPageAll + 1);
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
              : ""}

            {categories?.length > 0
              ? categories.map((cat, key) => {
                return (
                  <>
                    <div className={`tab-pane fade ${cat?.isActive}`} id={`pills-${cat._id}`} role="tabpanel" aria-labelledby={`pills-${cat._id}-tab`} key={key}>
                      <div className="row">
                        {cat?.CollectionData?.length > 0 ? cat.CollectionData.map((card, key1) => {
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
                          return (
                            <>
                              <div className="col-lg-4 col-md-6 mb-5" key={key1}>
                                <div className="collection_slide">
                                  <a href={`/collection/${card?._id}`}>
                                    <div className="mint_img">
                                      <img
                                        className="img-fluid w-100"
                                        src={card?.coverImg}
                                        onError={(e) => {
<<<<<<< HEAD
                                          e.target.src="../img/collections/list4.png";
=======
                                          e.target.src = "../img/collections/list4.png";
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
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
<<<<<<< HEAD
                                              e.target.src=
=======
                                              e.target.src =
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
                                                "../img/collections/list4.png";
                                            }}
                                          />
                                        </a>
                                      </div>
                                    </div>

                                    <h4 className="collname">
<<<<<<< HEAD
                                      {card.name?.length>15
                                        ? card.name?.slice(0,15)
                                        :card.name}
                                    </h4>
                                    <p>
                                      {card.desc?.length>15
                                        ? card.desc?.slice(0,15)+"..."
                                        :card.desc}
=======
                                      {card.name?.length > 15
                                        ? card.name?.slice(0, 15)
                                        : card.name}
                                    </h4>
                                    <p>
                                      {card.desc?.length > 15
                                        ? card.desc?.slice(0, 15) + "..."
                                        : card.desc}
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
<<<<<<< HEAD
                        }):("errlr")}
=======
                        }) : ("errlr")}
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
                      </div>
                    </div>
                  </>
                );
<<<<<<< HEAD
              }):""}
=======
              }) : ""}
>>>>>>> 1cb852a8c860212de8ee431de79f8b8c5776a86b
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplacecollection;
