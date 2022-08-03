import React from 'react';
import Profile from '../components/Profile';
import Sidebar from '../components/Sidebar';
// import LogInHeader from '../menu/LogInHeader';
import NFToffer from "../components/NFToffer";
import GeneralOffer from '../components/GeneralOffer'

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
              <div className="col-lg-3 usersidebar nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V4C21 3.46957 20.7893 2.96086 20.4142 2.58579C20.0391 2.21071 19.5304 2 19 2H5C4.46957 2 3.96086 2.21071 3.58579 2.58579C3.21071 2.96086 3 3.46957 3 4V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H6ZM12 4.999C13.647 4.999 15 6.35 15 7.999C15 9.647 13.647 11 12 11C10.353 11 9 9.647 9 7.999C9 6.35 10.353 4.999 12 4.999ZM6 17.25C6 15.031 8.705 12.75 12 12.75C15.295 12.75 18 15.031 18 17.25V18H6V17.25Z" fill="white"/>
                  </svg>
                  Profile
                </button>
                <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.8966 21.968C12.3666 21.97 11.8566 21.758 11.4826 21.382L3.64564 13.547C3.44131 13.3434 3.28363 13.0978 3.18349 12.8272C3.08335 12.5567 3.04314 12.2676 3.06564 11.98L3.56564 5.41401C3.60018 4.93599 3.80617 4.48652 4.1457 4.14827C4.48524 3.81002 4.93549 3.60574 5.41364 3.57301L11.9796 3.07301C12.0316 3.06201 12.0826 3.06201 12.1346 3.06201C12.6646 3.06201 13.1716 3.27201 13.5446 3.64801L21.3826 11.482C21.5684 11.6677 21.7158 11.8883 21.8164 12.131C21.917 12.3737 21.9687 12.6338 21.9687 12.8965C21.9687 13.1592 21.917 13.4194 21.8164 13.6621C21.7158 13.9048 21.5684 14.1253 21.3826 14.311L14.3106 21.382C14.1254 21.5683 13.905 21.716 13.6623 21.8166C13.4196 21.9172 13.1594 21.9687 12.8966 21.968ZM8.65364 6.65401C8.32475 6.65411 8.00096 6.73531 7.71094 6.89042C7.42093 7.04554 7.17364 7.26978 6.99099 7.54329C6.80834 7.8168 6.69596 8.13113 6.6638 8.45845C6.63164 8.78576 6.68069 9.11595 6.80662 9.41978C6.93255 9.72361 7.13146 9.99169 7.38574 10.2003C7.64002 10.4089 7.94181 10.5516 8.26439 10.6157C8.58698 10.6798 8.92039 10.6633 9.2351 10.5678C9.54982 10.4723 9.83611 10.3006 10.0686 10.068L10.0756 10.062L10.0826 10.055L10.0746 10.062C10.3526 9.78158 10.5414 9.42513 10.6171 9.03759C10.6928 8.65006 10.6522 8.24877 10.5002 7.88432C10.3482 7.51986 10.0918 7.20855 9.76318 6.98961C9.43457 6.77066 9.04851 6.65389 8.65364 6.65401Z" fill="white"/>
                  </svg>
                  Offers
                </button>
              </div>
              <div className="col-lg-9 tab-content" id="v-pills-tabContent">
                <div className="tab-pane fade show active profile_area pdd_8" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                  <Profile />
                </div>
                <div className="tab-pane fade profile_area pdd_8" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                  <h1 className="profile_h1 mb-3">Your Offers</h1>
                  <GeneralOffer />
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Userprofile
