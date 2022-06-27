import React from "react";
import { Rings } from "react-loader-spinner";
import "../components-css/App.css";

export default function Loader() {
  return (
    <section className="loader-section">
    <div className='loader-container'>
      <Rings className="loader" color='#ef981d' height={100} width={100} />
    </div>
    </section>
  );
}
