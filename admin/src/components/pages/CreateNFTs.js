import React, { useEffect, useState, Suspense } from "react";
import { NotificationManager } from "react-notifications";
import Sidebar from "../components/Sidebar";
import {
  createNft,
  createOrder,
  getAllCollections,
  GetBrand,
  GetMyCollectionsList,
  GetMyNftList,
  getNFTList,
  isSuperAdmin,
  UpdateStatus,
  UpdateTokenCount,
} from "../../apiServices";

import { useCookies } from "react-cookie";
import extendedERC721Abi from "./../../config/abis/extendedERC721.json";
import { exportInstance } from "../../apiServices";
import contracts from "./../../config/contracts";
import "../../App.css";
import { GLTFModel, AmbientLight, DirectionLight } from "react-3d-viewer";
import { slowRefresh } from "../../helpers/NotifyStatus";
import Spinner from "../components/Spinner";
import { WalletConditions } from "./../../helpers/WalletConditions";
import { onboard } from "../Navbar";
import PopupModal from "../components/popupModal";
import evt from "../../events/events";
import Logo from "../../logo1.svg";

function CreateNFTs() {
  const [nftImg, setNftImg] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState();
  const [currentUser, setCurrentUser] = useState();
  const uploadedImage = React.useRef(null);
  const uploadedPreviewImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const [cookies] = useCookies([]);
  const [collections, setCollections] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModal, setModal] = useState("");
  const [currAttrKey, setCurrAttrKey] = useState("");
  const [currAttrValue, setCurrAttrValue] = useState("");
  const [attrKeys, setAttrKeys] = useState([]);
  const [attrValues, setAttrValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [fileType, setFileType] = useState("Image");
  const [img, setImg] = useState();
  const [showAlert, setShowAlert] = useState("");
  const [walletVariable, setWalletVariable] = useState({});
  const [needPreview, setNeedPreview] = useState(false)
  const [nftPreviewImage, setNftPreviewImage] = useState()

  const handleImageUpload = (e) => {
    const [file] = e.target.files;

    if (file) {
      let url = e.target.files[0].name.split(/[#?]/)[0].split(".").pop().trim();
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      if (e.target.files && e.target.files[0]) {
        if (["mp4", "gif", "jpeg", "jpg", "png", "gltb", "gltf", "glb"].includes(url)) {


          if (url === "mp4") {
            setFileType("Video");
            let blobURL = URL.createObjectURL(e.target.files[0]);
            console.log(blobURL);
            setNftImg(e.target.files[0]);
            setImg(blobURL);
          } else if (
            url === "gif" ||
            url === "jpeg" ||
            url === "jpg" ||
            url === "png"
          ) {
            setFileType("Image");
            setNftImg(e.target.files[0]);
          } else if (
            url === "glb" ||
            url === "gltf" ||
            url === "gltb" || url === "glTF"
          ) {
            setNeedPreview(true)
            let blobURL = URL.createObjectURL(e.target.files[0]);

            setImg(blobURL);
            setNftImg(e.target.files[0]);
            setFileType("3D");
          }
        }
        else {
          NotificationManager.error("Invalid format", "", 800)
          return
        }
      }
    }
  };

  const handlePreviewImageUpload = (e) => {
    const [file] = e.target.files;

    if (file) {
      let url = e.target.files[0].name.split(/[#?]/)[0].split(".").pop().trim();
      const reader = new FileReader();
      const { current } = uploadedPreviewImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      if (e.target.files && e.target.files[0]) {
        if (["gif", "jpeg", "jpg", "png"].includes(url)) {

          setNftPreviewImage(e.target.files[0]);

        }
        else {
          NotificationManager.error("Invalid format", "", 800)
          return
        }
      }
    }
  };

  const handleValidationCheck = () => {
    if (nftImg === "" || nftImg === undefined) {
      NotificationManager.error("Please Upload Image", "", 800);
      return false;
    }
    if (title.trim() === "" || title === undefined) {
      NotificationManager.error("Please Enter Title", "", 800);
      return false;
    }
    if (description.trim() === "" || description === undefined) {
      NotificationManager.error("Please Enter Description", "", 800);
      return false;
    }
    if (collection === "" || collection === undefined) {
      NotificationManager.error("Please Choose Collection", "", 800);
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (cookies.da_selected_account) setCurrentUser(cookies.da_selected_account);
  }, [cookies.da_selected_account]);

  useEffect(() => {
    const fetch = async () => {
      let reqBody = {
        page: 1,
        limit: 12,
      };
      let res
      if (currentUser) {
        res = await GetMyNftList(reqBody);
        if (res && res.results && res.results.length > 0) {
          setNfts(res.results[0]);
        }
      }
      else if (isSuperAdmin()) {
        res = await getNFTList(reqBody)
        if (res && res.results && res.results.length > 0) {
          setNfts(res.results);
        }
      }

    };
    fetch();
  }, [currentUser, isSuperAdmin]);

  const handleCreateNFT = async () => {
    var formdata = new FormData();
    let createdNft;

    const wCheck = WalletConditions();
    if (wCheck !== undefined) {
      setShowAlert(wCheck);
      return;
    }

    if (handleValidationCheck()) {
      setLoading(true);
      setModal("");


      let collectionDetail;
      let NFTcontract;
      let reqBody = {
        page: 1,
        limit: 12,
        collectionID: JSON.parse(collection)._id,
        userID: "",
        categoryID: "",
        brandID: "",
        ERCType: "",
        searchText: "",
        filterString: "",
        isHotCollection: "",
        isMinted: "",
      };
      try {
        collectionDetail = await getAllCollections(reqBody);
        collectionDetail = collectionDetail?.results[0][0];
        console.log("c1", collectionDetail);
        await UpdateTokenCount(collectionDetail.contractAddress);

        formdata.append("attributes", JSON.stringify(attributes));
        formdata.append("levels", JSON.stringify([]));
        formdata.append("creatorAddress", currentUser.toLowerCase());
        formdata.append("name", title);
        formdata.append("nftFile", nftImg);
        formdata.append("previewImg", nftPreviewImage);
        formdata.append("quantity", quantity);
        formdata.append("collectionID", JSON.parse(collection)._id);
        formdata.append("collectionAddress", collectionDetail.contractAddress);
        formdata.append("description", description);
        formdata.append("tokenID", collectionDetail.nextID);
        formdata.append("type", collectionDetail.type);
        formdata.append("isMinted", 0);
        formdata.append("imageSize", "0");
        formdata.append("imageType", "0");
        formdata.append("imageDimension", "0");
        formdata.append("fileType", fileType);
      } catch (e) {
        console.log("e", e);
        NotificationManager.error("Something went wrong", "", 800);
        setLoading(false);
        return;
      }
      try {
        NFTcontract = await exportInstance(
          collectionDetail.contractAddress,
          extendedERC721Abi.abi
        );
        let approval = await NFTcontract.isApprovedForAll(
          currentUser,
          contracts.MARKETPLACE
        );
        let approvalRes;
        let options = {
          from: currentUser,
          gasLimit: 9000000,
          value: 0,
        };
        if (!approval) {
          approvalRes = await NFTcontract.setApprovalForAll(
            contracts.MARKETPLACE,
            true,
            options
          );
          approvalRes = await approvalRes.wait();
          if (approvalRes.status === 0) {
            NotificationManager.error("Transaction failed", "", 800);
            setLoading(false);
            return;
          }
          NotificationManager.success("Approved", "", 800);
        }

        let res1 = "";
        try {
          const options = {
            from: currentUser,
            gasLimit: 9000000,
            value: 0,
          };
          let mintRes = await NFTcontract.mint(
            currentUser,
            collectionDetail.nextID,
            options
          );
          formdata.append("hash", mintRes.hash)
          formdata.append("hashStatus", 0)
          try {
            createdNft = await createNft(formdata);
            let metaDatahash = "https://decryptnft.mypinata.cloud/ipfs/" + createdNft.metaDatahash

            let tokenId = parseInt(createdNft.tokenID, 10)

            let uri = await NFTcontract.setCustomTokenUri(tokenId, metaDatahash);
            let uriResult = await uri.wait()


            // NotificationManager.success("NFT created successfully", "", 800);
            // setLoading(false);
            // slowRefresh(1000);
          } catch (e) {
            console.log("err", e);
            NotificationManager.error("Something went wrong", "", 800);
            setLoading(false);
            return;
          }
          console.log("createdNft", createdNft._id);
          res1 = await mintRes.wait();
          if (res1.status === 0) {
            NotificationManager.error("Transaction failed", "", 800);
            return;
          }
          let req = {
            "recordID": createdNft._id,
            "DBCollection": "NFT",
            "hashStatus": 1
          }
          try {
            await UpdateStatus(req)
            NotificationManager.success("NFT created successfully", "", 800)
            setLoading(false);
            slowRefresh(1000)
            return;
          }
          catch (e) {
            setLoading(false);
            return
          }
        } catch (minterr) {
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log("e", e);
        NotificationManager.error("Something went wrong", "", 800);
        setLoading(false);
        return;
      }


    }
  };



  useEffect(() => {
    const fetch = async () => {
      let reqBody = {
        page: 1,
        limit: 20,
      };
      let data = await GetMyCollectionsList(reqBody);
      if (data && data.results && data.results[0].length > 0) {
        let res = data?.results[0].filter((d, i) => d.isMinted === 1);
        setCollections(res);
      }
    };
    fetch();
  }, []);

  const handlePropertyAdded = () => {
    if (currAttrKey.trim() === "" || currAttrValue.trim() === "") {
      setCurrAttrKey("");
      setCurrAttrValue("");
      NotificationManager.info("Please Enter Both the Fields", "", 800);
      return;
    }

    if (attrKeys.includes(currAttrKey)) {
      NotificationManager.error("Cannot Add Same Property Twice", "", 800);
      return;
    }

    let tempArr1 = [];
    let tempArr2 = [];
    if (currAttrKey) {
      tempArr1.push(...attrKeys, currAttrKey);
      tempArr2.push(...attrValues, currAttrValue);
    }

    setAttrKeys(tempArr1);
    setAttrValues(tempArr2);
    setCurrAttrKey("");
    setCurrAttrValue("");
  };

  const handlePropertyRemoved = async (index) => {
    let tempArr1 = [...attrKeys];
    tempArr1[index] = "";
    setAttrKeys(tempArr1);
    let tempArr2 = [...attrValues];
    tempArr2[index] = "";
    setAttrValues(tempArr2);


  };

  return (
    <div className='wrapper'>
      {showAlert === "chainId" ? <PopupModal content={<div className='popup-content1'>
        <div className='bid_user_details my-4'>
          <img src={Logo} alt='' />
          <div className='bid_user_address'>
            <div >
              <div className="mr-3">Required Network ID:</div>
              <span className="adr">
                {process.env.REACT_APP_NETWORK_ID}
              </span>
            </div>
            <div >
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
      {loading ? <Spinner /> : ""}
      <Sidebar />

      {/* <!-- Page Content  --> */}
      <div id='content'>
        <div className='add_btn mb-4 d-flex justify-content-end'>
          {isSuperAdmin()
            ? null
            : currentUser && (
              <button
                className='btn btn-admin text-light'
                type='button'
                // data-bs-toggle='modal'
                // data-bs-target='#NftModal'
                onClick={() => {
                  const wCheck = WalletConditions();
                  if (wCheck !== undefined) {
                    setShowAlert(wCheck);
                    return;
                  }
                  setModal("active")
                  }}>
                + Create NFTs
              </button>
            )}
        </div>
        <div className='adminbody table-widget text-light box-background'>
          <h5 className='admintitle font-600 font-24 text-yellow'>NFTs</h5>
          <br />
          {nfts && nfts.length > 0 ? (
            <table className='table table-hover text-light'>
              <thead>
                <tr>
                  <th>NFT Image</th>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {nfts && nfts.length > 0
                  ? nfts.map((n, i) => {
                    return (
                      <tr>
                        <td>
                          <img
                            src={n.image}
                            className='profile_i'
                            alt=''
                            onError={(e) =>
                              (e.target.src = n.previewImg)
                            }
                          />
                        </td>
                        <td>
                          {n.name
                            ? n.name?.length > 15
                              ? n.name?.slice(0, 15) + "..."
                              : n.name
                            : "-"}
                        </td>
                        <td>
                          {n.description
                            ? n.description?.length > 25
                              ? n.description?.slice(0, 25) + "..."
                              : n.description
                            : "-"}
                        </td>
                      </tr>
                    );
                  })
                  : "No NFTs Found"}
              </tbody>
            </table>
          ) : (
            "No NFT Found"
          )}
        </div>
      </div>
      <div
        className={`modal createNft ${isModal} `}
        id='NftModal'
        tabindex='-1'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
        data-keyboard='false'
        data-backdrop='static'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5
                className='modal-title text-yellow font-24 font-600'
                id='exampleModalLabel'>
                Create NFTs
              </h5>
              <button
                type='button'
                className='btn-close'
                // data-bs-dismiss='modal'
                onClick={() => setModal("")}
                aria-label='Close'
                ></button>
            </div>
            <div className='modal-body'>
              <form className='row'>
                <div className='mb-1 col-md-4 offset-md-4'>
                  <label for='recipient-name' className='col-form-label'>
                    Upload Image *
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <input
                      type='file'
                      accept='.glTF,.gltf,gltb,.glb,.mp4,.gif, .png, .jpeg, .jpg'
                      onChange={handleImageUpload}
                      ref={imageUploader}
                      style={{
                        display: "none",
                      }}
                    />
                    <div
                      className='update_btn'
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "relative",
                      }}
                      onClick={() => imageUploader.current.click()}>
                      <p className='text-center'>Click here</p>

                      {fileType === "Image" ? (
                        <img
                          alt=''
                          ref={uploadedImage}
                          key={img}
                          src={"../images/upload.png"}
                          className='img-fluid profile_circle_img admin_profile_img'
                        />
                      ) : (
                        ""
                      )}

                      {fileType === "Video" ? (
                        <video
                          className='img-fluid profile_circle_img admin_profile_img'
                          controls>
                          <source
                            ref={uploadedImage}
                            key={img}
                            src={img}
                            type='video/mp4'
                          />
                        </video>
                      ) : (
                        ""
                      )}
                      {fileType === "3D" ? (
                        <GLTFModel
                          height='280'
                          width='220'
                          position={{ x: 0, y: 0, z: 0 }}
                          //anitialias={false}
                          enableZoom={false}
                          ref={uploadedImage}
                          className='img-fluid profile_circle_img'
                          key={img}
                          src={img}
                        >

                          <AmbientLight color={0xffffff} />
                          <DirectionLight
                            color={0xffffff}
                            position={{ x: 100, y: 200, z: 100 }}
                          />
                        </GLTFModel>
                      ) : (
                        ""
                      )}

                    </div>
                  </div>

                </div>

                {needPreview &&
                  <div className='mb-1 col-md-4 offset-md-4'>
                    <label for='recipient-name' className='col-form-label'>
                      Upload Preview Image *
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <input
                        type='file'
                        accept='.gif, .png, .jpeg, .jpg'
                        onChange={handlePreviewImageUpload}
                        ref={imageUploader}
                        style={{
                          display: "none",
                        }}
                      />
                      <div
                        className='update_btn'
                        style={{
                          height: "100%",
                          width: "100%",
                          position: "relative",
                        }}
                        onClick={() => imageUploader.current.click()}>
                        <p className='text-center'>Click here</p>

                        <img
                          alt=''
                          ref={uploadedPreviewImage}
                          key={img}
                          src={"../images/upload.png"}
                          className='img-fluid profile_circle_img admin_profile_img'
                        />



                      </div>
                    </div>
                  </div>
                }
                <div className='col-md-12 mb-1'>
                  <label for='recipient-name' className='col-form-label'>
                    Title *
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='recipient-name'
                    value={title}
                    maxLength={25}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className='col-md-6 mb-1'>
                  <label for='recipient-name' className='col-form-label'>
                    Choose Collection *
                  </label>
                  <select
                    className='form-select'
                    aria-label='Default select example'
                    value={collection}
                    onChange={(e) => {
                      setCollection(e.target.value);
                      setQuantity(1);
                    }}>
                    <option value=''>Select</option>
                    {collections.length > 0
                      ? collections.map((c, i) => {
                        return (
                          <option value={JSON.stringify(c)}>{c.name}</option>
                        );
                      })
                      : ""}
                  </select>
                </div>

                {collection && JSON.parse(collection)?.type == 2 ? (
                  <div className='col-md-12 mb-1'>
                    <label for='recipient-name' className='col-form-label'>
                      Quantity *
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='recipient-name'
                      value={quantity}
                      // disabled={collection.type == 1 ? true : false}
                      onKeyPress={(e) => {
                        if (!/^\d*?\d*$/.test(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className='col-md-12 mb-1'>
                  <label for='message-text' className='col-form-label'>
                    Description *
                  </label>
                  <textarea
                    className='form-control'
                    id='message-text'
                    value={description}
                    maxLength={300}
                    onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className='col-md-6 mt-2'>
                  {/* {attrKeys[0] === "" ? ( */}
                  <p className='attr_header'>Attributes</p>
                  {/* ) : (
                    ""
                  )} */}
                  {attrKeys.length > 0 && attrValues.length > 0 ? (
                    attrKeys.map((attrKey, key) => {

                      return (
                        attrKey.trim() !== "" &&
                        <ul>
                          <li>
                            <span>
                              {attrKey} : {attrValues[key]}
                            </span>
                          </li>
                        </ul>
                      );
                    })
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-md-12">
                <form className='row justify-content-center '>
                {" "}
                <div className='col-md-6 mb-1'>
                  <input
                    type='text'
                    className='form-control col-md-6'
                    id='attribute-key'
                    placeholder='e.g. Size'
                    value={currAttrKey}
                    onChange={(e) => setCurrAttrKey(e.target.value)}
                  />
                </div>
                <div className='col-md-5 mb-1'>
                  <input
                    type='text'
                    className='form-control col-md-6'
                    id='attribute-value'
                    placeholder='e.g. M'
                    value={currAttrValue}
                    onChange={(e) => setCurrAttrValue(e.target.value)}
                  />
                </div>
                <button
                  type='button'
                  className='btn btn-admin text-light col-md-1 add_attr'
                  onClick={handlePropertyAdded}>
                  +
                </button>
              </form>
              <div className='row mt-3 attributeAdded_con'>
                {attrKeys && attrValues
                  ? attrKeys.map((attrKey, key) => {
                    return attrKey !== "" ? (
                      <div className='col-lg-6 col-md-6 col-sm-6'>
                        <div className='createProperty'>
                          <div className='nft_attr'>
                            <h5>{attrKey}</h5>
                            <h4>{attrValues[key]}</h4>
                          </div>
                          <button
                            className='remove-btn '
                            onClick={() => {
                              handlePropertyRemoved(key);
                            }}>
                            <i className='fa fa-trash' aria-hidden='true'></i>
                          </button>
                        </div>
                        <button
                          className='remove-btn '
                          onClick={() => {
                            handlePropertyRemoved(key);
                          }}></button>
                      </div>
                    ) : (
                      ""
                    );
                  })
                  : ""}
              </div>
                </div>
                
                {/* <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Brand *
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    {brands && brands.length > 0
                      ? brands.map((b, i) => {
                          return (
                            <option selected value="1">
                              {b.name}
                            </option>
                          );
                        })
                      : ""}
                  </select>
                </div> */}
              </form>
            </div>
            <div className='modal-footer justify-content-center'>
              <button
                type='button'
                className='btn btn-admin text-light'
                onClick={handleCreateNFT}>
                Create NFT
              </button>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default CreateNFTs;
