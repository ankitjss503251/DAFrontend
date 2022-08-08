import React from 'react';
import NotificationsArea from '../components/NotificationsArea';
import Sidebar from '../components/Sidebar';
// import LogInHeader from '../menu/LogInHeader';

function Notifications() {
  return (
    <div>
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
