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
} from "../../apiServices";

import { useCookies } from "react-cookie";
import extendedERC721Abi from "./../../config/abis/extendedERC721.json";
import { exportInstance } from "../../apiServices";
import contracts from "./../../config/contracts";
import { getSignature } from "./../../helpers/getterFunctions";
import { GENERAL_DATE, GENERAL_TIMESTAMP } from "../../helpers/constants";
import Loader from "../components/loader";
import "../../App.css";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { GLTFModel, AmbientLight, DirectionLight } from "react-3d-viewer";

function CreateNFTs() {
  const [nftImg, setNftImg] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState();
  const [currentUser, setCurrentUser] = useState();
  const uploadedImage = React.useRef(null);
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

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    console.log("file ttypee  isssss", e.target.files[0]);

    if (file) {
      console.log("file ldskjflakdjfl---->", file);
      let url = e.target.files[0].name.split(/[#?]/)[0].split(".").pop().trim();
      console.log("url is----->", url);
      const reader = new FileReader();
      const { current } = uploadedImage;

      console.log("current is----->", current);
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      if (e.target.files && e.target.files[0]) {
        if (url == "mp4") {
          console.log("nft file is---->", e.target.files[0]);
          setFileType("Video");
          let blobURL = URL.createObjectURL(e.target.files[0]);
          console.log(blobURL);
          setNftImg(e.target.files[0]);
          setImg(blobURL);
        } else if (
          url == "gif" ||
          url == "jpeg" ||
          url == "jpg" ||
          url == "png"
        ) {
          setFileType("Image");

          console.log("nft file else is---->", e.target.files[0]);
          setNftImg(e.target.files[0]);
        } else {
          console.log("in 3d");
          let blobURL = URL.createObjectURL(e.target.files[0]);
          console.log(blobURL);
          setImg(blobURL);
          setNftImg(e.target.files[0]);
          setFileType("3D");
        }
      }
    }
  };

  const handleValidationCheck =  () => {
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
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
  }, [cookies.selected_account]);

  useEffect(() => {
    const fetch = async () => {
      let reqBody = {
        page: 1,
        limit: 12,
      };
      let res = await GetMyNftList(reqBody);
      if (res && res.results && res.results.length > 0) {
        setNfts(res.results[0]);
      }
      console.log("Ress", res);
    };
    fetch();
  }, []);

  const handleCreateNFT = async () => {
    console.log("ATTRIBUTES", attributes);
   
    if (handleValidationCheck()) {
      setLoading(true);
      setModal("");
      let salt = Math.round(Math.random() * 10000000);

      var formdata = new FormData();
      let createRes;
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
        console.log("collectionDetail", collectionDetail);
        collectionDetail = collectionDetail?.results[0][0];
        console.log("collectionDetail11", collectionDetail);
        if (collectionDetail.totalSupply < collectionDetail.nftCount + 1) {
          console.log(
            "collection.totalSupply",
            collectionDetail.totalSupply < collectionDetail.nftCount + 1
          );
          NotificationManager.error(
            "Total Supply exceeded max supply",
            "",
            800
          );
          setLoading(false);
          return;
        }
        formdata.append("attributes", JSON.stringify(attributes));
        formdata.append("levels", JSON.stringify([]));
        formdata.append("creatorAddress", currentUser.toLowerCase());
        formdata.append("name", title);
        formdata.append("nftFile", nftImg);
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

        //for (var key of formdata.entries()) {
        //  console.log(key[0] + ', ' + key[1]);
        //}

        console.log("field values--->", formdata);
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
      } catch (e) {
        console.log("e", e);
        NotificationManager.error("Something went wrong", "", 800);
        setLoading(false);
        return;
      }
      //fd.append("attributes", JSON.stringify(attributes));
      //fd.append("levels", JSON.stringify([]));
      //fd.append("creatorAddress", currentUser.toLowerCase());
      //fd.append("name", title);
      //fd.append("nftFile", nftImg);
      //fd.append("quantity", quantity);
      //fd.append("collectionID", JSON.parse(collection)._id);
      //fd.append("collectionAddress", collectionDetail.contractAddress);
      //fd.append("description", description);
      //fd.append("tokenID", collectionDetail.nextID);
      //fd.append("type", collectionDetail.type);
      //fd.append("isMinted", 0);
      //fd.append("imageSize", "0");
      //fd.append("imageType", "0");
      //fd.append("imageDimension", "0");

      try {
        console.log("FormData before Call", formdata);
        createRes = await createNft(formdata);
      } catch (e) {
        console.log("err", e);
        NotificationManager.error("Something went wrong", "", 800);
        setLoading(false);
        return;
      }

      let sellerOrder = [
        currentUser.toLowerCase(),
        "0x8A23fe04CdDF650A6A73287Dd62c207F2F0C190A",
        collectionDetail.nextID,
        quantity,
        0,
        contracts.USDT,
        collectionDetail.price.$numberDecimal,
        GENERAL_TIMESTAMP,
        [],
        [],
        salt,
      ];

      console.log("sellerOrder", sellerOrder);
      try {
        let signature = await getSignature(currentUser, ...sellerOrder);
        if (signature === false) {
          NotificationManager.error("signature not found", "", 800);
          setLoading(false);
          return;
        }
        console.log("signature", signature);
        let reqParams = {
          nftId: createRes.data._id,
          tokenAddress: contracts.USDT,
          collection: "0x8A23fe04CdDF650A6A73287Dd62c207F2F0C190A",
          price: collectionDetail.price.$numberDecimal,
          quantity: quantity,
          saleType: 0,
          deadline: GENERAL_TIMESTAMP,
          signature: signature,
          tokenID: collectionDetail.nextID,
          deadlineDate: GENERAL_DATE,
          // auctionEndDate: _auctionEndDate,
          salt: salt,
        };

        await createOrder(reqParams);

        NotificationManager.success("NFT created successfully", "", 800);
        setLoading(false);
        console.log("NFTcontract", NFTcontract);
        setTimeout(() => {
          window.location.href = "/createnfts";
        }, 1000);
      } catch (e) {
        console.log("e", e);
        setLoading(false);
        setTimeout(() => {
          window.location.href = "/createnfts";
        }, 1000);
        return;
      }
    }
  };

  useEffect(() => {
    setCurrentUser(cookies.selected_account);
  }, [cookies.selected_account]);

  useEffect(() => {
    const fetch = async () => {
      let reqBody = {
        page: 1,
        limit: 20,
      };
      let data = await GetMyCollectionsList(reqBody);
      if (data && data.results && data.results.length > 0)
        setCollections(data?.results[0]);

      // console.log("data", data);
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

    if (attrKeys.includes(currAttrKey.toLowerCase())) {
      NotificationManager.error("Cannot Add Same Property Twice", "", 800);
      return;
    }

    let tempArr1 = [];
    let tempArr2 = [];
    if (currAttrKey) {
      tempArr1.push(...attrKeys, currAttrKey.toLowerCase());
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
      {/* <!-- Sidebar  --> */}
      {loading ? <Loader /> : ""}
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
                  data-bs-toggle='modal'
                  data-bs-target='#NftModal'
                  onClick={() => setModal("active")}>
                  + Add NFTs
                </button>
              )}
        </div>
        <div className='adminbody table-widget text-light box-background'>
          <h5 className='admintitle font-600 font-24 text-yellow'>NFTs</h5>
          <br />
          {nfts && nfts.length > 0 ? (
            <table class='table table-hover text-light'>
              <thead>
                <tr>
                  <th >NFT Image</th>
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
                                (e.target.src = "../images/login.jpg")
                              }
                            />
                          </td>
                          <td>{n.name}</td>
                          <td>{n.description}</td>
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
        className={`modal fade createNft ${isModal} `}
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
                data-bs-dismiss='modal'
                aria-label='Close'></button>
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
                      accept='.glTF,.gltf,.glb,.mp4,image/*'
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
                      <p className='text-center'>Click or Drop here</p>

                      {fileType == "Image" ? (
                        <img
                          alt=''
                          ref={uploadedImage}
                          src={"../images/upload.png"}
                          style={{
                            width: "110px",
                            height: "110px",
                            margin: "auto",
                          }}
                          className='img-fluid profile_circle_img'
                        />
                      ) : (
                        ""
                      )}

                      {fileType == "Video" ? (
                        <video
                          style={{
                            width: "110px",
                            height: "110px",
                            margin: "auto",
                          }}
                          className='img-fluid profile_circle_img'
                          controls>
                          <source
                            ref={uploadedImage}
                            src={img}
                            type='video/mp4'
                          />
                        </video>
                      ) : (
                        ""
                      )}

                      {fileType == "3D" ? (
                        <GLTFModel
                          height='280'
                          width='220'
                          position={{ x: 0, y: 0, z: 0 }}
                          anitialias={false}
                          //enableZoom={false}
                          ref={uploadedImage}
                          className='img-fluid profile_circle_img'
                          src={img}>
                          <AmbientLight color={0xffffff} />
                          <DirectionLight
                            color={0xffffff}
                            position={{ x: 100, y: 200, z: 100 }}
                          />
                          <DirectionLight
                            color={0xff00ff}
                            position={{ x: -100, y: 200, z: -100 }}
                          />
                        </GLTFModel>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>

                <div className='col-md-12 mb-1'>
                  <label for='recipient-name' className='col-form-label'>
                    Title *
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='recipient-name'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className='col-md-6 mb-1'>
                  <label for='recipient-name' className='col-form-label'>
                    Choose Collection *
                  </label>
                  <select
                    class='form-select'
                    aria-label='Default select example'
                    value={collection}
                    onChange={(e) => {
                      console.log("e.target.value", e.target.value);
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
                {console.log("collection?.type == 2", collection)}
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
                    onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className='col-md-6 mt-2'>
                  {attrKeys.length > 0 ? <p className="attr_header">Attributes</p> : ""}
                  {attrKeys.length > 0 && attrValues.length > 0 ? (
                    attrKeys.map((attrKey, key) => {
                      return <ul>
                        <li>
                          <span>{attrKey} : {attrValues[key]}</span>
                        </li>
                      </ul>
                    })
                  ) : (
                    <button
                      type='button'
                      data-bs-toggle='modal'
                      data-bs-target='#AttributeModal'
                      className='btn btn-admin text-light'>
                      Add Attributes
                    </button>
                  )}
                </div>

                {/* <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Brand *
                  </label>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    {console.log("brands--", brands)}
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
      <div
        className='modal fade'
        id='AttributeModal'
        tabindex='-1'
        aria-labelledby='attributeModal'
        aria-hidden='true'
        data-keyboard='false'
        data-backdrop='static'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5
                className='modal-title text-yellow font-24 font-600'
                id='exampleModalLabel'>
                Properties
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'></button>
            </div>
            <div className='modal-body'>
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
                              className='remove-btn btn-main'
                              onClick={() => {
                                handlePropertyRemoved(key);
                              }}>
                              <i className='fa fa-trash' aria-hidden='true'></i>
                            </button>
                          </div>
                          <button
                            className='remove-btn btn-main'
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
            <div className='modal-footer justify-content-center'>
              <button
                type='button'
                data-bs-toggle='modal'
                data-bs-target='#NftModal'
                className='btn btn-admin text-light'
                onClick={() => {
                  if (attrKeys.length > 0) {
                    let metaData = [];
                    for (let i = 0; i < attrKeys.length; i++) {
                      metaData.push({
                        trait_type: attrKeys[i],
                        value: attrValues[i],
                      });
                    }
                    setAttributes(metaData);
                    console.log("ATTRIBUTES", attributes);
                  }
                }}>
                Add Attributes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNFTs;
