import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import Sidebar from "../components/Sidebar";
import { useCookies } from "react-cookie";
import Loader from "../components/loader";
import { addBrand, GetBrand } from "../../apiServices";
import { isEmptyObject } from "jquery";

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

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    else NotificationManager.error("Connect Yout Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("current user is---->", currentUser, cookies.selected_account);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetch = async () => {
        let _myBrand = await GetBrand();
        setMyBrand(_myBrand);
        console.log("my collection-fgasdf->", myBrand);
      };
      fetch();
    }
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
    setLoading(true);
    setModal("");
    if (handleValidationCheck() == false) {
      setLoading(false);
      return;
    } else {
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
      {/* <!-- Sidebar  --> */}
      <Sidebar />
      {loading ? <Loader /> : ""}
      {/* <!-- Page Content  --> */}
      <div id="content">
        <div className="add_btn mb-4 d-flex justify-content-end">
          <button
            className="btn btn-admin text-light"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#brandModal"
            onClick={() => setModal("active")}
          >
            + Add Brand
          </button>
        </div>
        <div className="adminbody table-widget text-light box-background">
          <h5 className="admintitle font-600 font-24 text-yellow">Example</h5>
          <p className="admindescription">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <table class="table table-hover text-light">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <br></br>
            {myBrand &&
            myBrand !== undefined &&
            myBrand !== "" &&
            !isEmptyObject(myBrand) &&
            myBrand.length > 0
              ? myBrand.map((data, index) => (
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={data.logoImage}
                          className="profile_i"
                          alt=""
                        />
                      </td>
                      <td>{data.name}</td>
                      <td>{data.description}</td>
                    </tr>
                  </tbody>
                ))
              : "No Brands Found"}
          </table>
        </div>
      </div>
      <div
        className={`modal fade createNft ${isModal}`}
        id="brandModal"
        tabindex="-1"
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
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                <div className="mb-1 col-md-4">
                  <label for="recipient-name" className="col-form-label">
                    Upload Image *
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
                      <p className="text-center">Click or Drop here</p>
                      <img
                        alt=""
                        ref={uploadedImage}
                        src={"../images/upload.png"}
                        style={{
                          width: "110px",
                          height: "110px",
                          margin: "auto",
                        }}
                        className="img-fluid profile_circle_img"
                      />
                      {/* <div class="overlat_btn"><button type="" class="img_edit_btn"><i class="fa fa-edit fa-lg"></i></button></div> */}
                    </div>
                  </div>
                </div>
                <div className="mb-1 col-md-8">
                  <label for="recipient-name" className="col-form-label">
                    Upload Collection Cover Image *
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
                      <h4 className="text-center">Click or Drop here</h4>
                      <img
                        alt=""
                        ref={uploadedImage2}
                        src={"../images/upload.png"}
                        style={{
                          width: "110px",
                          height: "110px",
                          margin: "auto",
                        }}
                        className="img-fluid profile_circle_img"
                      />
                      {/* <div class="overlat_btn"><button type="" class="img_edit_btn"><i class="fa fa-edit fa-lg"></i></button></div> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="col-md-12 mb-1">
                  <label for="message-text" className="col-form-label">
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    value={description}
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
