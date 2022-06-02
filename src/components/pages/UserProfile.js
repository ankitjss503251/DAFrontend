import React from 'react';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';
// import LogInHeader from '../menu/LogInHeader';

const bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
  };

function Userprofile() {
  return (
    <div style={bgImgStyle}>
        <div className="container">
            <div className="row userinfo">
                <div className="col-lg-3 usersidebar">
                    <Sidebar />
                </div>
                <div className="col-lg-9">
                    <Profile />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Userprofile
