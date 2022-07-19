
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const Relatedcollection = (props) => {
  const [cnt, setCnt] = useState(0);
  const [viewAll, setViewAll] = useState("")

  useEffect(() => {
    if(viewAll)
         setCnt(props.collections.length);
         else
         setCnt(0)
  },[viewAll])


  return (
    <div className='row mb-5 justify-content-center'>
      {props.collections
        ? props.collections.slice(0,3).map((card, key) => {
            return (
              
              <div className='col-md-4 mb-4'>
                    <a href={`/collection/${card._id}`}>
                <div className='collection_slide'>
                  <img
                    src={card.coverImg}
                    class='img-fluid'
                    alt=''
                  />
                  <div className='collection_text'>
                    <div className='coll_profileimg'>
                      <img
                        alt=''
                        className='profile_img'
                        src={card.logoImg}
                      />
                      {/* <img
                        alt=''
                        className='check_img'
                        src={"../img/collections/check.png"}
                      /> */}
                    </div>
                    <h3 className='collname'>{card.name}</h3>
                    <p>ERC-721</p>
                  </div>
                </div>
                </a>
              </div>
            
            );
          })
        : ""}
        {props.collections
        ? props.collections.slice(4,cnt).map((card, key) => {
            return (
              
              <div className='col-md-4 mb-4'>
                    <Link to={`/collection/${card._id}`}>
                <div className='collection_slide'>
                  <div className="mint_img">
                    <img
                      src={card.coverImg}
                      class='img-fluid'
                      alt=''
                    />
                  </div>
                  <div className='collection_text'>
                    <div className='coll_profileimg'>
                      <div class="rotater_border profile_img">
                        <Link to="" class="rounded-circle">
                          <img
                            alt=''
                            className=''
                            src={card.logoImg}
                          />
                          
                          {/* <img
                            alt=''
                            className='check_img'
                            src={"../img/collections/check.png"}
                          /> */}
                        </Link>
                      </div>
                    </div>
                    <h3 className='collname'>{card.name}</h3>
                    <p>ERC-721</p>
                  </div>
                </div>
                </Link>
              </div>
            
            );
          })
        : ""}
        {
         ( props.collections?.length > 3 && viewAll === "") ?  <div class="col-md-12 text-center mt-5">
          <button className="view_all_bdr" onClick={() => setViewAll("show")}>
            View All
          </button>
        </div> : ""
        }
         {
         ( props.collections?.length > 3 && viewAll !== "") ?  <div class="col-md-12 text-center mt-5">
          <button className="view_all_bdr" onClick={() => setViewAll("")}>
            Hide
          </button>
        </div> : ""
        }
       
    </div>
  );
}

export default Relatedcollection;
