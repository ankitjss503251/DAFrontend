import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import Sidebar from "../components/Sidebar";
import { useCookies } from "react-cookie";
import { addBrand, GetBrand } from "../../apiServices";
import { isEmptyObject } from "../../helpers/utils";
import Spinner from "../components/Spinner";
import { WalletConditions } from "./../../helpers/WalletConditions";
import { onboard } from "../Navbar";
import PopupModal from "../components/popupModal";
import evt from "../../events/events";
import Logo from "../../logo1.svg";

function CreateBrands() {
  const [logoImg, setLogoImg] = useState();
  const [coverImg, setCoverImg] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [myBrand, setMyBrand] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [loading, setLoading] = useState(false);
  const [isModal, setModal] = useState("");
  const [showAlert, setShowAlert] = useState("");
  const [walletVariable, setWalletVariable] = useState({});

  useEffect(() => {
    if (cookies.da_selected_account) setCurrentUser(cookies.da_selected_account);
    // else NotificationManager.error("Connect Yout Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    // if (currentUser) {
    const fetch = async () => {
      let _myBrand = await GetBrand();
      setMyBrand(_myBrand);
      // };

    }
    fetch();
  }, [currentUser]);

  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      if (e.target.files && e.target.files[0]) {
        setLogoImg(e.target.files[0]);
      }
    }
  };

  const uploadedImage2 = React.useRef(null);
  const imageUploader2 = React.useRef(null);

  const handleImageUpload2 = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage2;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      if (e.target.files && e.target.files[0]) {
        setCoverImg(e.target.files[0]);
      }
    }
  };

  const handleValidationCheck = () => {
    if (logoImg === "" || logoImg === undefined) {
      NotificationManager.error("Please Upload Logo Image", "", 800);
      return false;
    }
    if (coverImg === "" || coverImg === undefined) {
      NotificationManager.error("Please Upload Cover Image", "", 800);
      return false;
    }
    if (title.trim() === "" || title === undefined) {
      NotificationManager.error("Please Enter a Title", "", 800);
      return false;
    }
    if (description.trim() === "" || description === undefined) {
      NotificationManager.error("Please Enter a Description", "", 800);
      return false;
    }
  };

  const handleCreateBrand = async () => {
    const wCheck = WalletConditions();
    if (wCheck !== undefined) {
      setShowAlert(wCheck);
      return;
    }
   
    if (handleValidationCheck() == false) {
      return;
    } else {
      setLoading(true);
      setModal("");
      var fd = new FormData();
      fd.append("name", title);
      fd.append("description", description);
      fd.append("logoImage", logoImg);
      fd.append("coverImage", coverImg);
      try {
        let brand = await addBrand(fd);

        NotificationManager.success(brand.message, "", 800);
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/createbrands";
        }, 1000);
      } catch (e) {
        console.log(e);
        NotificationManager.error(e.message, "", 800);
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/createbrands";
        }, 1000);
      }
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
       {showAlert === "chainId" ? <PopupModal content={<div className='popup-content1'>
        <div className='bid_user_details my-4'>
          <img src={Logo} alt='' />
          <div className='bid_user_address'>
          <div className="d-flex">
              <div className="mr-3">Required Network ID:</div>
              <span className="adr">
                {process.env.REACT_APP_NETWORK_ID}
              </span>
            </div>
            <div className="d-flex">
              <div className="mr-3">Required Network Name:</div>
              <span className="adr">
                {process.env.REACT_APP_NETWORK}
              </span>
            </div>
          </div>
        </div>
        <button
          className='btn-main mt-2' onClick={async () => {
            const isSwitched = await onboard.setChain({
              chainId: process.env.REACT_APP_CHAIN_ID,
            });
            if (isSwitched)
              setShowAlert("");
          }}>
          {"Switch Network"}
        </button>
      </div>} handleClose={() => { setShowAlert(!showAlert) }} /> :
        showAlert === "account" ? <PopupModal content={
          <div className='popup-content1'>
            <div className='bid_user_details my-4'>
              <img src={Logo} alt='' />
              <div className='bid_user_address align-items-center'>
                <div>
                  <span className="adr text-muted">
                    {cookies.da_selected_account}
                  </span>
                  <span className='badge badge-success'>Connected</span>
                </div>
                <p className="mb-3">Please switch to connected wallet address or click logout to continue with the current wallet address by disconnecting the already connected account.</p>
              </div>

              <button
                className='btn-main mt-2' onClick={() => {
                  console.log("logout btn click");
                  evt.emit("disconnectWallet")
                }}>
                {"Logout"}
              </button>
            </div>
          </div>} handleClose={() => { setShowAlert(!showAlert) }} /> :
          showAlert === "locked" ? <PopupModal content={<div className='popup-content1'>
            <div className='bid_user_details my-4'>
              <img src={Logo} alt='' />
              <div className='bid_user_address align-items-center'>
                <div>
                  <span className="adr text-muted">
                    {cookies.da_selected_account}
                  </span>
                  <span className='badge badge-success'>Connected</span>
                </div>
              </div>
              <h4 className="mb-3">Your wallet is locked. Please unlock your wallet and connect again.</h4>
            </div>
            <button
              className='btn-main mt-2' onClick={() => {
                evt.emit("disconnectWallet")
              }}>
              Connect Wallet
            </button>
          </div>} handleClose={() => { setShowAlert(!showAlert) }} /> : ""}
      {/* <!-- Sidebar  --> */}
      <Sidebar />
      {loading ? <Spinner /> : ""}
      {/* <!-- Page Content  --> */}
      <div id="content">
        {currentUser && (
          <div className="add_btn mb-4 d-flex justify-content-end">
            <button
              className="btn btn-admin text-light"
              type="button"
              // data-bs-toggle="modal"
              // data-bs-target="#brandModal"
              onClick={() => {
                const wCheck = WalletConditions();
                if (wCheck !== undefined) {
                  setShowAlert(wCheck);
                  return;
                }
                setModal("active")}}
            >
              + Add Brand
            </button>
          </div>
        )}
        <div className="adminbody table-widget text-light box-background">
          <h5 className="admintitle font-600 font-24 text-yellow">Brands</h5>

          <table className="table table-hover text-light">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>

            {myBrand &&
              myBrand !== undefined &&
              myBrand !== "" &&
              !isEmptyObject(myBrand) &&
              myBrand.length > 0
              ? myBrand.map((data, index) => (
                <tbody key={index}>
                  <tr>
                    <td><img
                      src={data.logoImage}
                      className="profile_i"
                      alt=""

                    /></td>
                    <td>{data.name ? data.name?.length > 8 ? data.name?.slice(0, 8) + "..." : data.name : "-"}</td>
                    <td>{data.description ? data.description?.length > 15 ? data.description?.slice(0, 15) : data.description : '-'}</td>
                  </tr>
                </tbody>
              ))
              : "No Brands Found"}
          </table>
        </div>
      </div>
      <div
        className={`modal createBrand ${isModal}`}
        id="brandModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-yellow font-24 font-600"
                id="exampleModalLabel"
              >
                Create New Brand
              </h5>
              <button
                type="button"
                className="btn-close"
                // data-bs-dismiss="modal"
                onClick={() => setModal("")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                <div className="mb-1 col-md-4">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Upload Logo *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={imageUploader}
                      style={{
                        display: "none",
                      }}
                    />
                    <div
                      className="update_btn"
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "relative",
                      }}
                      onClick={() => imageUploader.current.click()}
                    >
                      <p className="text-center">Click here</p>
                      <img
                        alt=""
                        ref={uploadedImage}
                        src={"../images/upload.png"}
                        className="img-fluid profile_circle_img admin_profile_img"
                      />
                      {/* <div className="overlat_btn"><button type="" className="img_edit_btn"><i className="fa fa-edit fa-lg"></i></button></div> */}
                    </div>
                  </div>
                </div>
                <div className="mb-1 col-md-8">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Upload Cover Image *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload2}
                      ref={imageUploader2}
                      style={{
                        display: "none",
                      }}
                    />
                    <div
                      className="update_btn"
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "relative",
                      }}
                      onClick={() => imageUploader2.current.click()}
                    >
                      <p className="text-center">Click here</p>
                      <img
                        alt=""
                        ref={uploadedImage2}
                        src={"../images/upload.png"}
                        className="img-fluid profile_circle_img admin_profile_img"
                      />
                      {/* <div className="overlat_btn"><button type="" className="img_edit_btn"><i className="fa fa-edit fa-lg"></i></button></div> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mb-1">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={title}
                    autoComplete="off"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col-md-12 mb-1">
                  <label htmlFor="message-text" className="col-form-label">
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    value={description}
                    autoComplete="off"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-admin text-light"
                onClick={handleCreateBrand}
              >
                Create Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBrands;
