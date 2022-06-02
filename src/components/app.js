import React ,{ useEffect } from "react";
// import ScrollToTopBtn from "./menu/ScrollToTop";
// import Header from "./menu/header";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Marketplacecollection from "./pages/Marketplacecollection";
import Marketplace from "./pages/Marketplace";
import NFTDetails from "./pages/NFTDetails";
import BlogTagged from "./pages/BlogTagged";
import Helpcenter from "./pages/Helpcenter";
import Collection from "./pages/collection";
import CollectionWithCollection from "./pages/CollectionWithCollection"
// import ItemDetail from "./pages/ItemDetail";
import Author from "./pages/Author";
import CollectionActivity from "./pages/CollectionActivity";
import UserProfile from "./pages/UserProfile";
import Profile from "./components/Profile";
import Notifications from "./pages/Notifications";
import NotificationsArea from "./components/NotificationsArea";
import Blog from "./pages/Blog";
import BlogContent from "./components/BlogContent"
import ContactUs from "./pages/ContactUs";
import MintCollection from "./pages/MintCollection";
import MintCollectionLive from "./pages/MintCollectionLive";

// import Create3 from "./pages/createMultiple";
import './components-css/App.css'
import Blogdetails from "./pages/Blogdetails";
import Minttab from "./components/Minttab";
import LoginHome from "./pages/LoginHome";
// import { createGlobalStyle } from "styled-components";
import UpdateProfile from "./pages/updateProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ItemNotFound from "./pages/ItemNotFound";
import MintingPage from "./pages/MintingPage";
// import MintEvent from "./components/MintEvent";
import MultiMintingPage from "./pages/MultiMintingPage";
import Partners from "./pages/Partners";
// import PartnersBanner from "./components/PartnersBanner";
import HelpCenterQuery from "./pages/HelpCenterQuery";
import HelpCenterDetail from "./pages/HelpCenterDetail";
import Offers from "./pages/Offers";
import AccountSupport from "./pages/AccountSupport";
import Earnings from "./pages/Earnings";
import Header from "./menu/header";
// import {DUMMY_COLLECTIONS} from "../dummyJSON";

import {NotificationContainer} from 'react-notifications';


const App = (props) => {
// console.log("DUMMY_COLLECTIONS", DUMMY_COLLECTIONS)

  
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/author/:id" element={<Author />} />
        <Route exact path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/marketplaceCollection" element={<Marketplacecollection />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/NFTdetails/:id" element={<NFTDetails />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/userprofile"element={<UserProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/collectionwithcollection" element={<CollectionWithCollection />} />
        <Route path="/collectionActivity" element={<CollectionActivity />} />
        <Route path="/Notifications" element={<Notifications />} />
        <Route path="/NotificationsArea" element={<NotificationsArea />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogcontent" element={<BlogContent />} />
        <Route path="/blogtagged" element={<BlogTagged />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blogdetails" element={<Blogdetails />} />
        <Route path="/helpcenter" element={<Helpcenter />} />
        <Route path="/mintcollection" element={<MintCollection />} />
        <Route path="/mintcollectionlive" element={<MintCollectionLive />} />
        <Route path="/minttab" element={<Minttab />} />
        <Route path="/loginhome" element={<LoginHome />} />
        {/* <Route path="/loginheader" element={<LogInHeader />} /> */}
        <Route path="/mintingpage" element={<MintingPage />} />
        <Route path="/multimintingpage/:id" element={<MultiMintingPage />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/helpcenterquery" element={<HelpCenterQuery />} />
        <Route path="/helpcenterdetail" element={<HelpCenterDetail />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/accountsupport" element={<AccountSupport />} />
        <Route path="*" element={ItemNotFound} />
        
      </Routes>
      <NotificationContainer/>
    </Router>
  );
};



export default App;