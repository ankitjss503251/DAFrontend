import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Sidebar from "../components/Sidebar";
import {
  createCollection,
  exportInstance,
  getCategory,
  getAllCollections,
  GetBrand,
  GetMyCollectionsList,
  UpdateCollection,
  blockUnBlockCollection,
  isSuperAdmin,
  importNft,
  UpdateStatus,
} from "../../apiServices";
import contracts from "../../config/contracts";
import degnrABI from "./../../config/abis/dgnr8.json";
import { ethers } from "ethers";
import { NotificationManager } from "react-notifications";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import abi from "./../../config/abis/generalERC721Abi.json";
import { GetOwnerOfToken } from "../../helpers/getterFunctions";
import { slowRefresh } from "../../helpers/NotifyStatus";
import Spinner from "../components/Spinner";
import { WalletConditions } from "./../../helpers/WalletConditions";
import { onboard } from "../Navbar";
import PopupModal from "../components/popupModal";
import evt from "../../events/events";
import Logo from "../../logo1.svg";

function CreateCollection(props) {
  const [logoImg, setLogoImg] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [title, setTitle] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [royalty, setRoyalty] = useState(10);
  const [loading, setLoading] = useState(false);
  const [maxSupply, setMaxSupply] = useState(1);
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [cookies] = useCookies([]);
  const [preSaleStartTime, setPreSaleStartTime] = useState("");
  const [datetime2, setDatetime2] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [myCollections, setMyCollections] = useState([]);
  const [nftType, setNftType] = useState("1");
  const [isModal, setIsModal] = useState("");
  const [importModal, setImportModal] = useState(false);
  const [importedAddress, setImportedAddress] = useState("");
  const [isOffChain, setIsOffChain] = useState("No");
  const [isOnMarketplace, setIsOnMarketplace] = useState("Yes");
  const [importedCollectionLink, setImportedCollectionLink] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newImportModal, setNewImportModal] = useState("");
  const [isEditModal, setIsEditModal] = useState("");
  const [reloadContent, setReloadContent] = useState(true);
  const [isMinted, setIsMinted] = useState(0);
  const [isEdit1, setIsEdit1] = useState(false);
  const [isEdit2, setIsEdit2] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [walletVariable, setWalletVariable] = useState({});
  const [addNew, setAddNew] = useState(false);



  useEffect(() => {
    if (cookies.da_selected_account)
      setCurrentUser(cookies.da_selected_account);
    // else NotificationManager.error("Connect Your Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.da_selected_account]);

  useEffect(() => {
    const fetch = async () => {
      let reqBody = {
        page: 1,
        limit: 12,
      };
      let data;
      if (isSuperAdmin()) {
        data = await GetMyCollectionsList(reqBody);
      }
      else if (currentUser) {
        data = await getAllCollections(reqBody);
      }
      if (data && data.results && data.results.length > 0)
        setMyCollections(data?.results[0]);
    };
    fetch();
  }, [currentUser, reloadContent]);

  useEffect(() => {
    const fetch = async () => {
      let _brands = await GetBrand();
      setBrands(_brands);
      setBrand(_brands[0]?._id);
      let _cat = await getCategory();
      setCategories(_cat);
      setCategory(_cat[0]?._id);
    };
    fetch();
  }, []);

  function handleChange(ev) {
    if (!ev.target["validity"].valid) return;
    console.log("evv.target", ev.target["value"]);
    const dt = ev.target["value"];
    const ct = moment(new Date()).format();

    if (dt < ct) {
      NotificationManager.error(
        "Start date should not be of past date",
        "",
        800
      );
      return;
    }
    setPreSaleStartTime(dt);
  }

  function handleChange2(evv) {
    if (!evv.target["validity"].valid) return;
    const dtt = evv.target["value"];
    if (dtt < preSaleStartTime) {
      NotificationManager.error(
        "End date should be greater than Start date",
        "",
        800
      );
      return;
    }
    setDatetime2(dtt);
  }

  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = (e) => {
    setIsEdit1(false);
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
    setIsEdit2(false);
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

  const numberInputCheck = (e) => {
    const re = /[+-]?[0-9]+\.?[0-9]*/;
    let val = e.target.value;
    if (val === "" || re.test(val)) {
      const numStr = String(val);
      if (numStr.includes(".")) {
        if (numStr.split(".")[1].length > 8) {
        } else {
          if (val.split(".").length > 2) {
            val = val.replace(/\.+$/, "");
          }
          if (val.length === 2 && val !== "0.") {
            val = Number(val);
          }
          setPrice(val);
        }
      } else {
        if (val.split(".").length > 2) {
          val = val.replace(/\.+$/, "");
        }
        if (val.length === 2 && val !== "0.") {
          val = Number(val);
        }
        setPrice(val);
      }
    }
  };

  const readReceipt = async (hash) => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    const reciept = await provider.getTransactionReceipt(hash.hash);
    console.log("reciept", reciept)
    let contractAddress = reciept?.logs?.length > 0 ? reciept.logs[0].address : "";
    return contractAddress;
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
      NotificationManager.error("Please Enter Title", "", 800);
      return false;
    }
    // if (royalty === "" || royalty === undefined) {
    //   NotificationManager.error("Please Enter the value for Royalty", "", 800);
    //   return false;
    // }

    if (category === "" || category === undefined) {
      NotificationManager.error("Please Choose a Category", "", 800);
      return false;
    }
    if (brand === "" || brand === undefined) {
      NotificationManager.error("Please Choose a Brand", "", 800);
      return false;
    }
    if (symbol.trim() === "" || symbol === undefined) {
      NotificationManager.error("Symbol can't be empty", "", 800);
      return false;
    }
    if (description.trim() === "" || description === undefined) {
      NotificationManager.error(
        "Please Enter a Description For Your Collection",
        "",
        800
      );
      return false;
    }
    return true;
  };

  //handle collection creator

  const handleCollectionCreationAndUpdation = async (isUpdate = false) => {
    let res1;
    let creator;
    const wCheck = WalletConditions();
    if (wCheck !== undefined) {
      setShowAlert(wCheck);
      return;
    }
    if (handleValidationCheck()) {
      setLoading(true);
      setIsModal("");
      setIsEditModal("");
      let contractAddress = "0x";
      if (isUpdate) {
        var fd = new FormData();
        fd.append("id", selectedCollectionId);
        fd.append("name", title);
        fd.append("symbol", symbol);
        fd.append("description", description);
        fd.append("isMinted", isMinted);
        fd.append("logoImage", logoImg);
        fd.append("coverImage", coverImg);
        fd.append("link", importedCollectionLink);
        fd.append("categoryID", category);
        fd.append("brandID", brand);
        fd.append("isOnMarketplace", isOnMarketplace === "Yes" ? 1 : 0);
        fd.append("preSaleStartTime", preSaleStartTime);
        fd.append("preSaleEndTime", datetime2);
        fd.append("preSaleTokenAddress", contracts.BUSD);
        fd.append("totalSupply", maxSupply);
        fd.append("type", Number(nftType));
        fd.append("price", ethers.utils.parseEther(price.toString()));
        fd.append("royalty", royalty * 1000);
        try {
          await UpdateCollection(fd);
          NotificationManager.success(
            "Collection updated successfully",
            "",
            800
          );
          setLoading(false);
          setTimeout(() => {
            window.location.href = "/createcollection";
          }, 1000);
        } catch (e) {
          console.log("error", e);
          return;
        }
      } else {
        try {
          creator = await exportInstance(contracts.CREATOR_PROXY, degnrABI);
        } catch (e) {
          console.log("err", e);
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          fd = new FormData();
          let type;
          if (nftType === "1") {
            type = 1;
          } else {
            type = 2;
          }
          fd.append("name", title);
          fd.append("symbol", symbol);
          fd.append("description", description);
          fd.append("logoImage", logoImg);
          fd.append("coverImage", coverImg);
          fd.append("categoryID", category);
          fd.append("brandID", brand);
          fd.append("isDeployed", isOffChain === "Yes" ? 1 : 0);
          fd.append("isOnMarketplace", isOnMarketplace === "Yes" ? 1 : 0);
          fd.append("isMinted", isOffChain === "Yes" ? 0 : 1);
          fd.append("isImported", 0);
          //fd.append("chainID", chain);
          fd.append("link", importedCollectionLink);
          fd.append("contractAddress", contractAddress);
          fd.append("preSaleStartTime", preSaleStartTime);
          fd.append("preSaleEndTime", datetime2);
          fd.append("preSaleTokenAddress", contracts.BUSD);
          fd.append("totalSupply", maxSupply);
          fd.append("type", type);
          fd.append("price", ethers.utils.parseEther(price.toString()));
          fd.append("royality", royalty * 1000);


          if (isOffChain === "No") {
            nftType === "1"
              ? (res1 = await creator.deployExtendedERC721(
                title,
                symbol,
                "www.uri.com",
                royalty * 100,
                contracts.BUSD
              ))
              : (res1 = await creator.deployExtendedERC1155(
                "www.uri.com",
                royalty * 100,
                contracts.BUSD
              ));

            let hash = res1;
            fd.append("hash", hash?.hash)
            fd.append("hashStatus", 0)
            let createdCollection;
            try {
              createdCollection = await createCollection(fd);
            } catch (e) {
              setLoading(false);
              NotificationManager.error(e.message, "", 800);
              slowRefresh(1000);
            }

            res1 = await res1.wait();
            contractAddress = await readReceipt(hash);
            let req = {
              "contractAddress": contractAddress,
              "recordID": createdCollection?._id,
              "DBCollection": "Collection",
              "hashStatus": 1
            }
            try {
              await UpdateStatus(req)
            }
            catch (e) {
              return
            }

          } else {
            res1 = {};
            res1.status = 1;
            fd.append("hash", "0x")
            fd.append("hashStatus", 1)
            try {
              await createCollection(fd);
            } catch (e) {
              setLoading(false);
              NotificationManager.error(e.message, "", 800);
              slowRefresh(1000);
            }
          }

        } catch (e) {
          console.log(e);
          setLoading(false);
          NotificationManager.error(e.message, "", 900);
          slowRefresh(1000);
        }

        if (res1 !== undefined) {
          NotificationManager.success(
            "collection created successfully",
            "",
            1800
          );
          setLoading(false);
          slowRefresh(1000);
        }
      }
    }
  };

  const handleImportNFT = async (isNew) => {
    window.sessionStorage.setItem("importLink", importedCollectionLink);
    let res;
    try {
      setLoading(true);
      const token = await exportInstance(importedAddress, abi);
      let originalSupply = await token.indicatesID();

      if (isNew) {
        let collection = await getAllCollections({
          contractAddress: importedAddress.toLowerCase(),
        });
        if (collection.count < 1) {
          var fd = new FormData();

          fd.append("isDeployed", 1);
          fd.append("isImported", 1);
          fd.append("isOnMarketplace", 1);
          fd.append("name", title);
          fd.append("isMinted", 1);
          fd.append("contractAddress", importedAddress.toLowerCase());
          fd.append("totalSupply", parseInt(originalSupply) - 1);
          fd.append("link", importedCollectionLink);

          res = await createCollection(fd);
        } else {
          NotificationManager.error("Collection already imported", "", 800);
          setLoading(false);
          return;
        }
      } else {
        let fd = new FormData();
        fd.append("contractAddress", importedAddress.toLowerCase());
        fd.append("link", importedCollectionLink);
        fd.append("isDeployed", 1);
        fd.append("id", selectedCollectionId);
        fd.append("isOnMarketplace", 1);
        fd.append("isImported", 1);
        fd.append("totalSupply", parseInt(originalSupply) - 1);

        res = await UpdateCollection(fd);
      }

      for (let i = 1; i < parseInt(originalSupply); i++) {
        let tokenId = i;
        try {
          let uri = await token.tokenURI(tokenId);
          let resp = await fetch(uri);
          resp = await resp.json();
          let owner = await GetOwnerOfToken(
            importedAddress,
            parseInt(tokenId),
            true,
            currentUser
          );
          resp.owner = owner;
          resp.tokenID = parseInt(tokenId);
          resp.collectionAddress = importedAddress;
          resp.isOnMarketplace = 1;
          resp.isImported = 1;
          resp.collectionID = res?._id;
          resp.totalQuantity = 1;
          await importNft({ nftData: resp });
        } catch (e) {
          console.log("error", e);
          continue;
        }
      }
      NotificationManager.success("Imported successfully");
      setLoading(false);
      slowRefresh(1000);
      return;
    } catch (e) {
      console.log("error", e);
      setLoading(false);
      return;
    }
  };

  const setShowOnMarketplace = async (id, show) => {
    try {
      let fd = new FormData();
      fd.append("id", id);
      fd.append("isOnMarketplace", show);
      await UpdateCollection(fd);
      NotificationManager.success("Collection Updated Successfully", "", 800);
      setReloadContent(!reloadContent);
    } catch (e) {
      console.log(e);
      NotificationManager.error(e.message, "", 1500);
    }
  };

  const handleEditCollection = async (_selectedCollectionId) => {
    try {
      const reqData = {
        page: 1,
        limit: 1,
        collectionID: _selectedCollectionId,
      };
      const res1 = await getAllCollections(reqData);
      const res2 = res1.results[0][0];
      console.log("edit collection res", res2);
      setLogoImg(res2.logoImage);
      setCoverImg(res2.coverImage);
      setTitle(res2.name);
      setRoyalty(res2.royalityPercentage);
      setPreSaleStartTime(res2.preSaleStartTime);
      setDatetime2(res2.preSaleEndTime);
      setMaxSupply(res2.totalSupply);
      setPrice(Number(convertToEth(res2.price?.$numberDecimal)));
      setCategory(res2.categoryID?._id);
      setBrand(res2.brandID?._id);
      setDescription(res2.description);
      setSymbol(res2.symbol);
      setIsMinted(res2.isMinted);
      setImportedCollectionLink(res2.link);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleCollection = async (collectionID, field, value) => {
    try {
      let fd = new FormData();
      fd.append("id", collectionID);
      fd.append(field, value);
      await UpdateCollection(fd);
      NotificationManager.success("Collection updated Successfully", "", 800);
      setReloadContent(!reloadContent);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const blockUnblockColl = (id, status) => {
    blockUnBlockCollection(id, status)
      .then((res) => {
        setReloadContent(Math.random());
      })
      .catch((e) => { });
  };

  const clearState = () => {
    setBrand("");
    setLogoImg("");
    setCoverImg("");
    setTitle("");
    setPrice(0);
    setPreSaleStartTime("");
    setDatetime2("");
    setMaxSupply("");
    setCategory("");
    setDescription("");
    setSymbol("");
    setIsMinted("");
    setImportedCollectionLink("");
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
        {isSuperAdmin()
          ? null
          : currentUser && (
            <>
              <div className="add_btn mb-4 d-flex justify-content-end">
                <button
                  className="btn btn-admin text-light"
                  type="button"
                  // data-bs-toggle="modal"
                  // data-bs-target="#exampleModal"
                  onClick={() => {
                    const wCheck = WalletConditions();
                    if (wCheck !== undefined) {
                      setShowAlert(wCheck);
                      return;
                    }
                    clearState();
                    setIsModal("active");
                  }}
                >
                  Create New Collection
                </button>
              </div>

            </>
          )}
        <div className="adminbody table-widget text-light box-background ">
          <h5 className="admintitle font-600 font-24 text-yellow text-center">
            Collections
          </h5>
          <br />
          <div className="table-responsive">
            <table className="table table-hover text-light">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Title</th>
                  <th>Symbol</th>
                  <th>Description</th>
                  <th>Total Supply</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Brand</th>
                </tr>
              </thead>

              <tbody>
                {myCollections &&
                  myCollections != undefined &&
                  myCollections != "" &&
                  myCollections.length > 0
                  ? myCollections.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td>
                            {" "}
                            <div className="first-col">
                              <img
                                src={item.logoImage}
                                className="profile_i m-2"
                                alt=""
                                onError={(e) =>
                                  (e.target.src = "../images/login.jpg")
                                }
                              />
                              <div className="dates-col">
                                <span>
                                  {" "}
                                  Start Date:&nbsp;{" "}
                                  {item.preSaleStartTime
                                    ? moment(item.preSaleStartTime).format(
                                      "MMMM Do YYYY"
                                    )
                                    : "-"}
                                </span>
                                <span>
                                  End Date: &nbsp;{" "}
                                  {item.preSaleEndTime
                                    ? moment(item.preSaleEndTime).format(
                                      "MMMM Do YYYY"
                                    )
                                    : "-"}
                                </span>
                              </div>
                            </div>
                            {isSuperAdmin() ? (
                              <div className="btn_container">
                                <button
                                  className="btn p-1   text-light "
                                  type="button"
                                  onClick={() => {
                                    blockUnblockColl(
                                      item?._id,
                                      item.status ? 0 : 1
                                    );
                                  }}
                                >
                                  {item.status === 0 ? "Unblock" : "Block"}
                                </button>
                              </div>
                            ) : (
                              <div className="btn_container">
                                {item.isImported === 0 &&
                                  item.isMinted === 0 ? (
                                  <button
                                    className="btn p-1  text-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal1"
                                    type="button"
                                    onClick={async () => {
                                      setSelectedCollectionId(item?._id);
                                      setImportModal(true);
                                    }}
                                  >
                                    Import
                                  </button>
                                ) : (
                                  ""
                                )}
                                <button
                                  className={`btn p-1 showHide-btn ${!item.isOnMarketplace ? "active" : ""
                                    }`}
                                  type="button"
                                  onClick={async () => {
                                    item.isOnMarketplace === 0
                                      ? await setShowOnMarketplace(
                                        item?._id,
                                        1
                                      )
                                      : await setShowOnMarketplace(
                                        item?._id,
                                        0
                                      );
                                  }}
                                >
                                  {item.isOnMarketplace === 0
                                    ? "Show"
                                    : "Hide"}
                                </button>

                                <button
                                  className="btn p-1  text-light"
                                  type="button"
                                  // data-bs-toggle="modal"
                                  // data-bs-target="#editModal"
                                  onClick={async () => {
                                    setIsEdit1(true);
                                    setIsEdit2(true);
                                    setSelectedCollectionId(item?._id);
                                    setIsEditModal("active");
                                    handleEditCollection(item?._id);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className={`btn p-1 exclusive-btn ${!item?.isExclusive ? "active" : ""
                                    }`}
                                  type="button"
                                  onClick={() =>
                                    handleCollection(
                                      item?._id,
                                      "isExclusive",
                                      !item.isExclusive ? 1 : 0
                                    )
                                  }
                                >
                                  Exclusive Collection
                                </button>
                                <button
                                  className={`btn p-1  hot-btn ${!item?.isHotCollection ? "active" : ""
                                    }`}
                                  type="button"
                                  onClick={() =>
                                    handleCollection(
                                      item?._id,
                                      "isHotCollection",
                                      !item.isHotCollection ? 1 : 0
                                    )
                                  }
                                >
                                  Hot Collection
                                </button>
                              </div>
                            )}
                          </td>
                          <td>
                            {item?.name
                              ? item.name?.length > 8
                                ? item.name?.slice(0, 8) + "..."
                                : item?.name
                              : "-"}
                          </td>
                          <td>{item?.symbol ? item?.symbol : "-"}</td>
                          <td>
                            {item?.description
                              ? item?.description?.length > 15
                                ? item?.description?.slice(0, 15) + "..."
                                : item?.description
                              : "-"}
                          </td>

                          <td>{item?.totalSupply ? item?.totalSupply : "0"}</td>
                          <td>
                            {item?.price?.$numberDecimal
                              ? Number(
                                convertToEth(item?.price?.$numberDecimal)
                              ).toFixed(4)
                              : "-"}
                          </td>
                          <td>
                            {item?.categoryID?.name
                              ? item?.categoryID?.name
                              : "-"}
                          </td>
                          <td>
                            {item?.brandID?.name ? item?.brandID?.name : "-"}
                          </td>
                        </tr>
                        <br></br>
                      </>
                    );
                  })
                  : "No Collections Found"}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`modal createCol ${isModal}`}
          // id="exampleModal"
          // tabindex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-yellow font-24 font-600"
                  id="exampleModalLabel"
                >
                  Create New Collection
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  // data-bs-dismiss="modal"
                  onClick={() => setIsModal("")}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form className="row">
                  <div className="mb-1 col-md-4">
                    <label for="recipient-name" className="col-form-label">
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
                        {isEdit1 && logoImg ? (
                          <img
                            alt=""
                            ref={uploadedImage}
                            src={logoImg}
                            className="img-fluid profile_circle_img admin_profile_img"
                          />
                        ) : logoImg && !isEdit1 ? (
                          <img
                            alt=""
                            ref={uploadedImage}
                            src={URL.createObjectURL(logoImg)}
                            className="img-fluid profile_circle_img admin_profile_img"
                          />
                        ) : (
                          <img
                            alt=""
                            ref={uploadedImage}
                            src={"../images/upload.png"}
                            className="img-fluid profile_circle_img admin_profile_img"
                          />
                        )}

                      </div>
                    </div>
                  </div>
                  <div className="mb-1 col-md-8">
                    <label for="recipient-name" className="col-form-label">
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

                        {isEdit2 && coverImg ? (
                          <img
                            alt=""
                            ref={uploadedImage}
                            src={coverImg}
                            className="img-fluid profile_circle_img admin_profile_img"
                          />
                        ) : coverImg && !isEdit2 ? (
                          <img
                            alt=""
                            ref={uploadedImage}
                            src={URL.createObjectURL(coverImg)}
                            className="img-fluid profile_circle_img admin_profile_img"
                          />
                        ) : (
                          <img
                            alt=""
                            ref={uploadedImage}
                            src={"../images/upload.png"}
                            className="img-fluid profile_circle_img admin_profile_img"
                          />
                        )}

                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      name="title"
                      value={title}
                      autoComplete="off"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={(preSaleStartTime || "")
                        .toString()
                        .substring(0, 16)}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={(datetime2 || "").toString().substring(0, 16)}
                      onChange={handleChange2}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Max Supply
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={maxSupply}
                      autoComplete="off"
                      onChange={(e) => {
                        setMaxSupply(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (!/^\d*?\d*$/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={price}
                      autoComplete="off"
                      onChange={(e) => numberInputCheck(e)}
                      onKeyPress={(e) => {
                        if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Category *
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option selected>Open this select menu</option>
                      {categories && categories.length > 0
                        ? categories.map((c, i) => {
                          return <option value={c._id}>{c.name}</option>;
                        })
                        : ""}
                    </select>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Brand *
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      <option selected>Open this select menu</option>
                      {brands && brands.length > 0
                        ? brands.map((b, i) => {
                          return <option value={b._id}>{b.name}</option>;
                        })
                        : ""}
                    </select>
                  </div>
                  <div className="col-md-12 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Symbol *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={symbol}
                      autoComplete="off"
                      onChange={(e) => setSymbol(e.target.value)}
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
                      autoComplete="off"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Minting Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      name="title"
                      autoComplete="off"
                      value={importedCollectionLink}
                      onChange={(e) => {
                        setImportedCollectionLink(e.target.value);
                      }}
                    />
                  </div>
                  {/*  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      NFT Type *
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={nftType}
                      onChange={(e) => setNftType(e.target.value)}
                    >
                      <option selected>Open this select menu</option>
                      <option value="1">Single</option>;
                      <option value="2">Multiple</option>;
                    </select>
                    </div>*/}

                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      OffChain
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={isOffChain}
                      onChange={(e) => setIsOffChain(e.target.value)}
                    >
                      <option selected>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Show on Marketplace
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={isOnMarketplace}
                      onChange={(e) => setIsOnMarketplace(e.target.value)}
                    >
                      <option selected>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-admin text-light"
                  onClick={() => handleCollectionCreationAndUpdation(false)}
                >
                  Create Collection
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`modal fade importCol ${importModal}`}
          id="exampleModal1"
          tabindex="-1"
          aria-labelledby="exampleModal1Label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-yellow font-24 font-600"
                  id="exampleModal1Label"
                >
                  Import Existing Collection
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
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Collection Address *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={importedAddress}
                      name="address"
                      autoComplete="off"
                      onChange={(e) => {
                        setImportedAddress(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Collection Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={importedCollectionLink}
                      name="address"
                      autoComplete="off"
                      onChange={(e) => {
                        setImportedCollectionLink(e.target.value);
                      }}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-admin text-light"
                  onClick={async () => {
                    await handleImportNFT(false);
                  }}
                >
                  Import Collection
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`modal fade importCol ${newImportModal}`}
          id="exampleModal2"
          tabindex="-1"
          aria-labelledby="exampleModal2Label"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-yellow font-24 font-600"
                  id="exampleModal1Label"
                >
                  Import New Collection
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
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Collection Address *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={importedAddress}
                      name="address"
                      autoComplete="off"
                      onChange={(e) => {
                        setImportedAddress(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Collection Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={importedCollectionLink}
                      name="address"
                      autoComplete="off"
                      onChange={(e) => {
                        setImportedCollectionLink(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Collection Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={title}
                      autoComplete="off"
                      name="title"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                </form>
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-admin text-light"
                  onClick={async () => {
                    await handleImportNFT(true);
                  }}
                >
                  Import Collection
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`modal createCol ${isEditModal}`}
          id="editModal"
          tabindex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title text-yellow font-24 font-600"
                  id="exampleModalLabel"
                >
                  Update Collection
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  // data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setIsEditModal("")}
                ></button>
              </div>
              <div className="modal-body">
                <form className="row">
                  <div className="mb-1 col-md-4">
                    <label for="recipient-name" className="col-form-label">
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
                          src={logoImg}
                          className="img-fluid profile_circle_img admin_profile_img"
                        />
                        {/* <div className="overlat_btn"><button type="" className="img_edit_btn"><i className="fa fa-edit fa-lg"></i></button></div> */}
                      </div>
                    </div>
                  </div>
                  <div className="mb-1 col-md-8">
                    <label for="recipient-name" className="col-form-label">
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
                          src={coverImg}
                          className="img-fluid profile_circle_img admin_profile_img"
                        />
                        {/* <div className="overlat_btn"><button type="" className="img_edit_btn"><i className="fa fa-edit fa-lg"></i></button></div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      name="title"
                      value={title}
                      autoComplete="off"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                  {/*<div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Royalty *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={royalty}
                      name="royalty"
                      onKeyPress={(e) => {
                        if (!/^\d*?\d*$/.test(e.key)) e.preventDefault();
                      }}
                      onChange={(e) => {
                        if (e.target.value > 100) {
                          NotificationManager.error(
                            "Royalty can't be greater than 100",
                            "",
                            800
                          );
                          return;
                        }
                        setRoyalty(e.target.value);
                      }}
                    />
                  </div> 
                  */}

                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={(preSaleStartTime || "")
                        .toString()
                        .substring(0, 16)}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      value={(datetime2 || "").toString().substring(0, 16)}
                      onChange={handleChange2}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Total Supply
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={maxSupply}
                      autoComplete="off"
                      onChange={(e) => {
                        setMaxSupply(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (!/^\d*?\d*$/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={price}
                      autoComplete="off"
                      onChange={(e) => numberInputCheck(e)}
                      onKeyPress={(e) => {
                        if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Category *
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option selected>Open this select menu</option>
                      {categories && categories.length > 0
                        ? categories.map((c, i) => {
                          return (
                            <option
                              value={c._id}
                              selected={category === c.name ? true : false}
                            >
                              {c.name}
                            </option>
                          );
                        })
                        : ""}
                    </select>
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Brand *
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      <option selected>Open this select menu</option>
                      {brands && brands.length > 0
                        ? brands.map((b, i) => {
                          return <option value={b._id}>{b.name}</option>;
                        })
                        : ""}
                    </select>
                  </div>
                  <div className="col-md-12 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Symbol *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={symbol}
                      autoComplete="off"
                      onChange={(e) => setSymbol(e.target.value)}
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
                  <div className="col-md-12 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      Minting Link *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={importedCollectionLink}
                      autoComplete="off"
                      onChange={(e) =>
                        setImportedCollectionLink(e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-1">
                    <label for="recipient-name" className="col-form-label">
                      NFT Type *
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={nftType}
                      onChange={(e) => setNftType(e.target.value)}
                    >
                      <option selected>Open this select menu</option>
                      <option value="1">Single</option>;
                      <option value="2">Multiple</option>;
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-admin text-light"
                  onClick={() => {
                    handleCollectionCreationAndUpdation(true);
                  }}
                >
                  Update Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CreateCollection);
