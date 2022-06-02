import React from 'react';
import NotificationsArea from '../components/NotificationsArea';
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

function Notifications() {
  return (
    <div style={bgImgStyle}>
        <div className="container">
            <div className="row userinfo">
                <div className="col-lg-3 usersidebar">
                    <Sidebar />
                </div>
                <div className="col-lg-9">
                    <NotificationsArea />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Notifications
