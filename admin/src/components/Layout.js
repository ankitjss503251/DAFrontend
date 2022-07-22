import React, { useState, useEffect } from "react";
import {Outlet} from 'react-router-dom';
import Sidebar from "./components/Sidebar"


const Layout = (props) => {
  return <div className="wrapper">
      {/* <!-- Sidebar  --> */}
      <Sidebar />
      <Outlet/>
  </div>    
};

export default Layout;
