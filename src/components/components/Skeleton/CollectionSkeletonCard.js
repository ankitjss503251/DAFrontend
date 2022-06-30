import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionSkeletonCard = ({ cards }) => {
   return Array(cards).fill(0).map((_,i) => (
    <div className="col-lg-4 col-md-6 mb-5" key={i}>
    <div className="collection_slide">
      
     <Skeleton height={200} />
    

      <div className="collection_text">
      <div className="coll_profileimg"  style={{ zIndex: 10 }}>

<Skeleton circle={true} height={80} width={82.56}  />
 </div>
       <div>
          <h4 className="collname"><Skeleton /></h4>
          <p><Skeleton /></p>
       </div>
      
      </div>
    </div>
  </div>
   ));
}

export default CollectionSkeletonCard;