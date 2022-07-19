import React from "react";
import {ThreeCircles} from "../SVG/spinner";

const Spinner = () => {
  return (
    <div className="spinner-container popup-box">
     <ThreeCircles
  color="#ef981d"
  outerCircleColor="#f9bf50"
  middleCircleColor="#f9bf50"
  innerCircleColor="#ef981d"
  height={110}
  width={110}
  ariaLabel="three-circles-rotating"
/>
    </div>
  )
}

export default Spinner;
