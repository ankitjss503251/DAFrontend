import React from "react";

function Relatedcollection(props) {
  return (
    <div className='row mb-5 justify-content-center'>
      {props.collections
        ? props.collections.map((card, key) => {
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
                      <img
                        alt=''
                        className='check_img'
                        src={"../img/collections/check.png"}
                      />
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
    </div>
  );
}

export default Relatedcollection;
