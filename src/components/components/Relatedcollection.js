import React from "react";
import { Link } from "react-router-dom";

function Relatedcollection(props) {
  return (
    <div className='row mb-5 justify-content-center'>
      {props.collections
        ? props.collections.map((card, key) => {
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
    </div>
  );
}

export default Relatedcollection;
