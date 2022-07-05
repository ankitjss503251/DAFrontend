import React, { useState, useEffect } from "react";
import Slider from "./slick-loader/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCollections } from "../../helpers/getterFunctions";

function CarouselCollection() {
  const [hotCollections, setHotCollections] = useState([]);
  useEffect(async () => {
    try {
      const res = await getCollections({
        page: 1,
        limit: 12,
        isHotCollection: 1,
      });
      setHotCollections(res);
     console.log("hot collections", res)
    } catch (e) {
      console.log("Error in fetching all hot collections list", e);
    }
  }, []);

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
                <div
                  className='collection_slide'
                  key={key}
                >
                  <a href={`/collection/${card._id}`} style={{borderRadius: "inherit"}}>
                    <img src={card.coverImg} class='img-fluid w-100' alt='' onError={(e) => e.target.src = "../img/collections/list4.png"}/>
                    </a>
                    <div className='collection_text'>
                    <a href={`/collectionwithcollection/${card?.brand?._id}`}>
                      <div className='coll_profileimg'>
                        <img
                          alt=''
                          className='profile_img'
                          src={card?.brand?.logoImage}
                          onError={(e) => e.target.src = "../img/collections/list4.png"}
                        />
                        <img
                          alt=''
                          className='check_img'
                          src={"../img/collections/check.png"}
                        />
                      </div>
                      </a>
                      <a href={`/collection/${card._id}`} >
                      <h3 className='collname'>{card.name}</h3>
                      <p>{card.desc}</p>
                      </a>
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
