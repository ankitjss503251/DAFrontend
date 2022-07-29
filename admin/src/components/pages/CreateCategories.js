import React, { useState, useEffect, useMemo } from "react";
import { NotificationManager } from "react-notifications";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import Deletesvg from "../SVG/deletesvg";
import { addCategory, getCategory } from "../../apiServices";
import { useCookies } from "react-cookie";
import Spinner from "../components/Spinner";
import { WalletConditions } from "./../../helpers/WalletConditions";
import { onboard } from "../Navbar";
import PopupModal from "../components/popupModal";
import evt from "../../events/events";
import Logo from "../../logo1.svg";

function CreateCategories() {
  const [catImg, setCatImg] = useState();
  const [CategorieName, setCategorieName] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [myCategory, setMyCategory] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModal, setModal] = useState("");
  const [showAlert, setShowAlert] = useState("");
  const [walletVariable, setWalletVariable] = useState({});

  useEffect(() => {
    if (cookies.da_selected_account) setCurrentUser(cookies.da_selected_account);
    // else NotificationManager.error("Connect Yout Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useMemo(() => {
    // if (currentUser) {
    const fetch = async () => {
      let _myBrand = await getCategory();
      setMyCategory(_myBrand);
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
        setCatImg(e.target.files[0]);
      }
    }
  };

  const handleValidationCheck = () => {
    if (catImg === "" || catImg === undefined) {
      NotificationManager.error("Please Upload Category Image", "", 800);
      return false;
    }
    if (CategorieName.trim() === "" || CategorieName === undefined) {
      NotificationManager.error("Please Enter Category Name", "", 800);
      return false;
    }
    return true;
  };

  const handleCreateCategory = async () => {
    const wCheck = WalletConditions();
    setWalletVariable(wCheck)

    if (wCheck.isLocked) {
      setShowAlert("locked");
      return;
    }

    if (!wCheck.isLocked) {
      if (!wCheck.cCheck) {
        setShowAlert("chainId");
        return;
      }
      if (!wCheck.aCheck) {
        setShowAlert("account")
        return;
      }
    }
    setLoading(true);
    setModal("");
    if (handleValidationCheck() == false) {
      setLoading(false);
      return;
    } else {
      var fd = new FormData();
      fd.append("name", CategorieName);

      fd.append("image", catImg);

      try {
        let categories = await addCategory(fd);

        if (categories.message == "Category created") {
          NotificationManager.success("Category created successfully", "", 800);
        } else {
          NotificationManager.error(categories.message, "", 800);
        }
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/createcategories";
        }, 1000);
      } catch (e) {
        console.log(e);
        NotificationManager.error(e.message, "", 800);
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/createcategories";
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
              <div className="mr-3">Required Network ID:&nbsp;</div>
              <span className="adr">
                {walletVariable.sChain}
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
                    {walletVariable.sAccount}
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
                    {walletVariable.sAccount}
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
              data-bs-toggle="modal"
              data-bs-target="#NftModal"
              onClick={() => setModal("active")}
            >
              + Add Categories
            </button>
          </div>
        )}

        <div className="adminbody table-widget text-light box-background">
          <h5 className="admintitle font-600 font-24 text-yellow">Categories</h5>
          <table className="table table-hover text-light">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
              </tr>
            </thead>
            <br></br>
            {myCategory &&
              myCategory != undefined &&
              myCategory != "" &&
              myCategory.length > 0
              ? myCategory.map((data, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{data.name ? data.name?.length > 8 ? data.name?.slice(0, 8) + "..." : data.name : "-"}</td>
                    <td>
                      <img src={data.image} className="profile_i" alt="" />
                    </td>
                  </tr>
                </tbody>
              ))
              : "No Categories Found"}
          </table>
        </div>
      </div>

      <div
        className={`modal fade createNft ${isModal}`}
        id="NftModal"
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
                Create New Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                <div className="mb-1 col-md-4 offset-md-4">
                  <label for="recipient-name" className="col-form-label">
                    Upload Category Image *
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
                <div className="col-md-12 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={CategorieName}
                    onChange={(e) => setCategorieName(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-admin text-light"
                onClick={handleCreateCategory}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCategories;
