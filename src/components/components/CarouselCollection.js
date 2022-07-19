import React, { useState, useEffect } from "react";
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCollections } from "../../helpers/getterFunctions";

function CarouselCollection() {
  const [hotCollections, setHotCollections] = useState([]);
  useEffect( () => {
      const fetch = async () => {
        try {
          const res = await getCollections({
            page: 1,
            limit: 12,
            isHotCollection: 1,
          });
          setHotCollections(res);
        } catch (e) {
          console.log("Error in fetching all hot collections list", e);
        }
      };
      fetch();
  }
    
   
  , []);

  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className='nft hc'>
      <Slider {...settings}>
        {hotCollections
          ? hotCollections.map((card, key) => {
              return (
               
                  <div className='collection_slide' key={key}>
                    <a href={`/collection/${card?._id}`}>
                      <div class="mint_img">
                        <img
                          style={{
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                          }}
                          src={card.logoImg}
                          class='img-fluid'
                          alt=''
                          onError={(e) =>
                            (e.target.src = "../img/collections/list4.png")
                          }
                        />
                      </div>
                    </a>
                    <div className='collection_text text-center'>
                      
                      <div className='coll_profileimg'>
                        <div className="rotater_border profile_img">
                        <a className="rounded-circle" href={`/collectionwithcollection/${card?.brand?._id}`}>
                          <img
                            alt=''
                            className=''
                            src={card.brand?.logoImage}
                            onError={(e) => {
                              e.target.src = "../img/collections/list4.png";
                            }}
                          />
                          {/* <img
                                  alt=''
                                  className='check_img'
                                  src={"../img/collections/check.png"}
                                /> */}
                        </a>
                        </div>
                      </div>
                      
                      
                        <h4 className='collname'>
                          <a href={`/collection/${card?._id}`}>
                            {card?.name?.length > 15 ? card?.name?.slice(0,15) + "..." : card?.name}
                          </a>
                        </h4>
                        <p>{card.desc ? (card.desc?.length > 20 ? card.desc?.slice(0,20) + "..." : card.desc) : "-"}</p>
                      
                    </div>
                  </div>
               
              );
            })
          : ""}
      </Slider>
    </div>
  );
}

export default CarouselCollection;
