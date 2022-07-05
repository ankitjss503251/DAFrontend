import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard = ({ cards, grid }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => (
      <div className={grid}>
        <div className='items_slide' key={i}>
          <Skeleton
            circle={true}
            height={80}
            width={82.56}
            style={{ zIndex: 10 }}
          />
          <div className='nft-cont'>
            <Skeleton height={231} style={{ borderRadius: 5 }} />
          </div>
          <div className='items_text nft-info-div'>
            <div className='items_info '>
              <div className='items_left'>
                <h3>
                  {" "}
                  <Skeleton height={15} />
                </h3>
                <p>
                  <Skeleton height={15} />
                </p>
              </div>
              <div className='items_right justify-content-end d-flex'>
                <Skeleton height={20} width={20} />
              </div>
            </div>
            <Skeleton height={40} style={{ borderRadius: 50 }} />
          </div>
        </div>
      </div>
    ));
};

export default SkeletonCard;
