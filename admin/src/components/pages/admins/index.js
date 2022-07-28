import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { NotificationManager } from "react-notifications";
import Loader from "../../components/loader";
import {
  adminUsers,
  saveAdminUser,
  blockUnBlockAdmin,
} from "../../../apiServices";


function Admins() {
  const [state, setState] = useState({ records: [], loading: false, toggleModal: '', category: {}, reload: 0 });
  const { category } = state;



  useEffect(() => {
    adminUsers(1).then(({ data }) => {
      setState(state => ({ ...state, records: (data.count > 0 ? data.results : []) }))
    })
  }, [state.reload]);

  function getStatusLabel(_status) {
    let status = { 1: "Active", 0: "Inactive" };
    return status[_status] || " ";
  }

  function blockUnblockUser(id, status) {
    blockUnBlockAdmin(id, status).then(res => {
      setState(state => ({ ...state, reload: Math.random() }));
    }).catch(e => {

    });
  }


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
        setState(state => ({ ...state, category: Object.assign(state.category, { profileIcon: e.target.files[0] }) }));
      }
    }
  };
  const handleValidationCheck = () => {
    if (category.profileIcon === "" || category.profileIcon === undefined) {
      NotificationManager.error("Please Upload User Image", "", 800);
      return false;
    }
    if (category?.fullname?.trim() === "" || category.fullname === undefined) {
      NotificationManager.error("Please Enter Name", "", 800);
      return false;
    }
    if (category?.walletAddress?.trim() === "" || category.walletAddress === undefined) {
      NotificationManager.error("Please Enter Wallet Address", "", 800);
      return false;
    }
    return true;
  };
  const handleSaveAdmin = async (e) => {
    setState(state => ({ ...state, loading: true }));
    if (handleValidationCheck() == false) {
      setState(state => ({ ...state, loading: false }));
      return;
    } else {
      var fd = new FormData();
      category.adminID = category._id;
      Object.entries(category).forEach(([name, val]) => {
        fd.append(name, val);
      })

      try {
        let user = await saveAdminUser(fd, category?._id);
        NotificationManager.success(user.message, "", 2000);
        setState(state => ({ ...state, loading: false, reload: Math.random(), toggleModal: '', category: {} }));
        window.location.reload()
        document.querySelector('.modal-backdrop')?.classList.toggle('show');
      } catch (e) {
        let error = await e.getBody();
        NotificationManager.error(error.message, "", 2000);
        setState(state => ({ ...state, loading: false }));
      }
      // setState(state=>({...state,loading:false}));
    }
  };




  return (
    <div className="wrapper">
      {/* <!-- Sidebar  --> */}
      <Sidebar />
      {state.loading ? <Loader /> : ""}
      {/* <!-- Page Content  --> */}
      <div id="content">
        <div className="add_btn mb-4 d-flex justify-content-end">
          <button
            className="btn btn-admin text-light"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#adminModal"
            onClick={() => { setState(state => ({ ...state, toggleModal: 'show' })) }}>
            + Add Admin
          </button>
        </div>

        <div className="adminbody table-widget text-light box-background">
          <h5 className="admintitle font-600 font-24 text-yellow">Admin's List</h5>
          <p className="admindescription">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
          <table className="table table-hover text-light">
            <thead>

              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Wallet Address</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>

            {state.records.length > 0 ?
              state.records.map((item, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>
                        {" "}
                        <img
                          src={item?.profileIcon ? item?.profileIcon : ""}
                          className="profile_i m-2"
                          alt=""
                          onError={(e) =>
                            (e.target.src = "./../images/login.jpg")
                          }
                        />
                      </td>
                      <td>{item.fullname}</td>
                      <td>{item.walletAddress}</td>
                      <td>{getStatusLabel(item.status)}</td>



                      <td>

                        <div className="btn_container">

                          <button
                            className="btn btn-admin m-1 p-1 text-light "
                            type="button"
                            onClick={() => {
                              blockUnblockUser(item._id, item.status ? 0 : 1);
                            }}
                          >
                            {item.status === 0 ? "Active" : "Inactive"}
                          </button>

                          <button
                            className="btn btn-admin m-1 p-1 text-light"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#adminModal"
                            onClick={() => { setState(state => ({ ...state, category: item, toggleModal: 'show' })) }}>
                            Edit
                          </button>

                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })
              : <tfoot><tr><td colSpan={5} align="center">No Record Found</td></tr></tfoot>}
          </table>
        </div>
      </div>

      {/** Modal for edit admin */}
      <div
        className={`modal fade createNft ${state.toggleModal}`}
        id="adminModal"
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
                {category._id ? 'Update' : 'Create New'}  Admin
              </h5>
              <button
                type="button"
                onClick={e => { setState(state => ({ ...state, category: { fullname: "", walletAddress: "" } })) }}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="row">
                <div className="mb-1 col-md-4 offset-md-4">
                  <label htmlFor="recipient-name" className="col-form-label">
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
                        src={category.profileIcon || "../images/upload.png"}
                        style={{
                          width: "110px",
                          height: "110px",
                          margin: "auto",
                        }}
                        className="img-fluid profile_circle_img"
                      />
                      {/* <div className="overlat_btn"><button type="" className="img_edit_btn"><i className="fa fa-edit fa-lg"></i></button></div> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mb-1">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"

                    value={category?.fullname}
                    onChange={(e) => setState(state => ({ ...state, category: Object.assign(state.category, { fullname: e.target.value }) }))}
                  />
                </div>
                <div className="col-md-12 mb-1">
                  <label htmlFor="recipient-name" className="col-form-label">
                    Wallet Address *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-wallet"

                    value={category?.walletAddress}
                    onChange={(e) => setState(state => ({ ...state, category: Object.assign(state.category, { walletAddress: e.target.value }) }))}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                disabled={state.loading}
                className="btn btn-admin text-light"
                onClick={handleSaveAdmin}
              >
                {state.loading ? 'Submiting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Admins;
