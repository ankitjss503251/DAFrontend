import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionsNFT = ({ cards, grid }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => (
      <div className={grid} key={i}>
        <div className='collection_items'>
          <Skeleton height={306.52} />
          <div className='coll_itemstext'>
            <div className='collection_row'>
              <div className='collection_col'>
                <Skeleton width={100} />
              </div>
              <div className='collection_col text-end'>
                <Skeleton width={50} />
              </div>
            </div>
            <div className='collection_row align-items-center'>
              <div className='collection_col'>
                <Skeleton
                  width={100}
                  height={30}
                  style={{ borderRadius: "50px" }}
                />
              </div>
              <div className='collection_col text-end'>
                <Skeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
};

export default CollectionsNFT;
