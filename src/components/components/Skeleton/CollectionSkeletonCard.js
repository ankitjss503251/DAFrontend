import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionSkeletonCard = ({ cards }) => {
   return Array(cards).fill(0).map((_,i) => {
    <div className="col-lg-4 col-md-6 mb-5">
    <div className="collection_slide">
     <Skeleton circle={true} height={80} width={82.56} />
      <div className="collection_text">
       <Skeleton />
       <div>
          <h4 className="collname"><Skeleton /></h4>
          <p><Skeleton /></p>
       </div>
      
      </div>
    </div>
  </div>
    })
}

export default CollectionSkeletonCard;