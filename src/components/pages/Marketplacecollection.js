import React,{useState,useEffect} from "react";
import Footer from "../components/footer";
import {getCategoryWithCollectionData, getCollections} from "../../helpers/getterFunctions";
import {useParams} from "react-router-dom";
import BGImg from "./../../assets/images/background.jpg";
import MarketplaceBGIamge from "../../assets/marketplace-bg.jpg";
import CollectionSkeletonCard from "../components/Skeleton/CollectionSkeletonCard";

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

  const [allCollections,setAllCollections]=useState([]);
  const [currPageAll,setCurrPageAll]=useState(1);
  const [currPage,setCurrPage]=useState(1);
  const [loadMore,setLoadMore]=useState(false);
  const [loadMoreDisabledAll,setLoadMoreDisabledAll]=useState("");
  const [categories,setCategories]=useState([]);
  const {searchedText}=useParams();
  const [loader,setLoader]=useState(false);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    const fetch=async () => {
      setLoader(true);
      try {
        const res1=await getCategoryWithCollectionData();
        if(res1.length>0) {
          for(const myCat of res1) {
            myCat.IsActive="";
            myCat.IsActiveTab="";
          }
        }
        setCategories(res1);
      } catch(e) {
        console.log("Error in fetching all collections list",e);
      }
      setLoader(false);
    };
    fetch();
  },[loadMore,searchedText]);


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
                {categories?.length>0 ?
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-allNFTs-tab" data-bs-toggle="pill" data-bs-target="#pills-allNFTs" type="button" role="tab" aria-controls="pills-allNFTs" aria-selected="true">All</button>
                  </li>
                :""}
                {categories?.length>0
                  ? categories.map((cat,key) => {
                    return (
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" id={`pills-${cat._id}-tab`} data-bs-toggle="pill" data-bs-target={`#pills-${cat._id}`} type="button" role="tab" aria-controls={`pills-${cat._id}`} aria-selected="true">{cat.name}</button>
                      </li>
                    );
                  }):""}
              </ul>
            </div>
          </div>
          <div className="tab-content" id="pills-tabContent">
            {categories?.length>0 ?
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
            : "" }

            {categories?.length>0
              ? categories.map((cat,key) => {
                return (
                  <>
                    <div className="tab-pane fade" id={`pills-${cat._id}`} role="tabpanel" aria-labelledby={`pills-${cat._id}-tab`} key={key}>
                      <div className="row">
                        {cat?.CollectionData?.length>0? cat.CollectionData.map((card,key1) => {
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
                            </>
                          )
                        }):("errlr")}
                      </div>
                    </div>
                  </>
                );
              }):""}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Marketplacecollection;
