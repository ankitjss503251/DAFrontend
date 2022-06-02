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
      console.log("result of getHotCollections helper fn--->", res);
      setHotCollections(res);
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
    <div className='nft'>
      <Slider {...settings}>
        {hotCollections
          ? hotCollections.map((card, key ) => {
              return (
                
                <div className='collection_slide' key={key}>
                  <a href={`/multimintingpage/${card._id}`}>
                  <img src={card.logoImg} class='img-fluid w-100' alt='' />
                  <div className='collection_text'>
                    <div className='coll_profileimg'>
                      <img alt='' className='profile_img' src={card.coverImg} />
                      <img
                        alt=''
                        className='check_img'
                        src={"../img/collections/check.png"}
                      />
                    </div>
                    <h3 className='collname'>{card.name}</h3>
                    <p>{card.desc}</p>
                  </div>
                  </a>
                </div>
              );
            })
          : ""}
      </Slider>
    </div>
  );
}

export default CarouselCollection;
