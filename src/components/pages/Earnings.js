import React from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from '@reach/router';
// import LogInHeader from '../menu/LogInHeader';

const bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

function Earnings() {
  return (
    <div style={bgImgStyle}>
        <div className="container">
            <div className="row userinfo">
                <div className="col-md-3 usersidebar">
                    <Sidebar />
                </div>
                <div className="col-md-9">
                    <div className="profile_area pdd_8">
                        <h1 className="profile_h1">Earnings</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Earnings
