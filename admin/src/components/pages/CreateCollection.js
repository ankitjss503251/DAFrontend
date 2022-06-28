import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Sidebar from "../components/Sidebar";
import {
  createCollection,
  exportInstance,
  getCategory,
  getAllCollections,
  GetBrand,
  // getImportedNFTs,
  getNFTList,
  GetMyCollectionsList,
  importCollection,
  UpdateCollection,
  createNft,
} from "../../apiServices";
import contracts from "../../config/contracts";
import degnrABI from "./../../config/abis/dgnr8.json";
import { ethers } from "ethers";
//import Loader from "../components/loader";
import { NotificationManager } from "react-notifications";
import Loader from "../components/loader";
import { convertToEth } from "../../helpers/numberFormatter";
import moment from "moment";
import abi from "./../../config/abis/generalERC721Abi.json";
import { GetOwnerOfToken } from "../../helpers/getterFunctions";

function CreateCollection() {
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
  const [isModal, setModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [importedAddress, setImportedAddress] = useState("");
  const [isOffChain, setIsOffChain] = useState("No");
  const [isOnMarketplace, setIsOnMarketplace] = useState("Yes");
  const [importedCollectionLink, setImportedCollectionLink] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newImportModal, setNewImportModal] = useState("");
  const [isEditModal, setIsEditModal] = useState("");
  const [reloadContent, setReloadContent] = useState(true);

  useEffect(() => {
    if (cookies.selected_account) setCurrentUser(cookies.selected_account);
    // else NotificationManager.error("Connect Your Metamask", "", 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.selected_account]);

  useEffect(() => {
    if (currentUser) {
      const fetch = async () => {
        let reqBody = {
          page: 1,
          limit: 12,
        };

        let data = await GetMyCollectionsList(reqBody);
        if (data && data.results && data.results.length > 0)
          setMyCollections(data?.results[0]);
      };
      fetch();
    }
  }, [currentUser, reloadContent]);

  useEffect(() => {
    const fetch = async () => {
      let _brands = await GetBrand();
      console.log("_brands", _brands);
      setBrands(_brands);

      let _cat = await getCategory();
      setCategories(_cat);
      console.log("_cat", _cat);
    };
    fetch();
  }, []);

  function handleChange(ev) {
    if (!ev.target["validity"].valid) return;
    const dt = ev.target["value"] + ":00Z";
    const ct = moment().toISOString();
    if (dt < ct) {
      NotificationManager.error(
        "Start date should not be of past date",
        "",
        800
      );
      return;
    }
    console.log("start date---->", dt, ct);
    setPreSaleStartTime(dt);
  }

  function handleChange2(evv) {
    if (!evv.target["validity"].valid) return;
    const dtt = evv.target["value"] + ":00Z";
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
    console.log("provider is--->", provider);
    const receipt = await provider.getTransactionReceipt(hash.hash);
    let contractAddress = receipt.logs[0].address;
    return contractAddress;
  };

  const handleValidationCheck = () => {
    if (!currentUser) {
      return false;
    }
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
    if (royalty === "" || royalty === undefined) {
      NotificationManager.error("Please Enter the value for Royalty", "", 800);
      return false;
    }

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

    if (handleValidationCheck()) {
      setLoading(true);
      setModal("");
      setIsEditModal("");
      let contractAddress = "0x";
      console.log("category", category);
      if (isUpdate) {
        var fd = new FormData();
        fd.append("id", selectedCollectionId);
        fd.append("name", title);
        fd.append("symbol", symbol);
        fd.append("description", description);
        fd.append("logoImage", logoImg);
        fd.append("coverImage", coverImg);
        fd.append("link", importedCollectionLink);
        fd.append("categoryID", category);
        fd.append("brandID", brand);
        fd.append("isOnMarketplace", isOnMarketplace === "Yes" ? 1 : 0);
        fd.append("preSaleStartTime", preSaleStartTime);
        fd.append("preSaleEndTime", datetime2);
        fd.append("preSaleTokenAddress", contracts.USDT);
        fd.append("totalSupply", maxSupply);
        fd.append("type", Number(nftType));
        fd.append("price", ethers.utils.parseEther(price.toString()));
        fd.append("royalty", royalty * 1000);
        try {
          await UpdateCollection(fd);
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
          console.log("creator is---->", creator);
          console.log("create collection is called");
          console.log("contracts usdt address", contracts.USDT);
        } catch (e) {
          console.log("err", e);
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          if (isOffChain === "No") {
            nftType === "1"
              ? (res1 = await creator.deployExtendedERC721(
                  title,
                  symbol,
                  "www.uri.com",
                  royalty * 100,
                  contracts.USDT
                ))
              : (res1 = await creator.deployExtendedERC1155(
                  "www.uri.com",
                  royalty * 100,
                  contracts.USDT
                ));

            let hash = res1;
            res1 = await res1.wait();
            contractAddress = await readReceipt(hash);
          } else {
            res1 = {};
            res1.status = 1;
          }
        } catch (e) {
          console.log(e);
          NotificationManager.error(e.message, "", 1500);
          setLoading(false);
        }

        console.log("contract address is--->", contractAddress);
        if (res1.status === 1) {
          let type;
          if (nftType === "1") {
            type = 1;
          } else {
            type = 2;
          }

          fd = new FormData();
          fd.append("name", title);
          fd.append("symbol", symbol);
          fd.append("description", description);
          fd.append("logoImage", logoImg);
          fd.append("coverImage", coverImg);
          fd.append("categoryID", category);
          fd.append("brandID", brand);
          fd.append("isDeployed", isOffChain == "Yes" ? 1 : 0);
          fd.append("isOnMarketplace", isOnMarketplace == "Yes" ? 1 : 0);
          //fd.append("chainID", chain);
          fd.append("link", importedCollectionLink);
          fd.append("contractAddress", contractAddress);
          fd.append("preSaleStartTime", preSaleStartTime);
          fd.append("preSaleEndTime", datetime2);
          fd.append("preSaleTokenAddress", contracts.USDT);
          fd.append("totalSupply", maxSupply);
          fd.append("type", type);
          fd.append("price", ethers.utils.parseEther(price.toString()));
          fd.append("royality", royalty * 1000);

          console.log("form data is---->", fd.value);

          try {
            let collection = await createCollection(fd);
            console.log("create Collection response is--->", collection);
            setLoading(false);
            if (collection === "Collection created") {
              NotificationManager.success(
                "collection created successfully",
                "",
                1800
              );
              setLoading(false);
              setTimeout(() => {
                window.location.href = "/createcollection";
              }, 1000);
            } else {
              NotificationManager.error(collection, "", 1800);
              console.log("category message", collection);
              setLoading(false);
            }
          } catch (e) {
            NotificationManager.error(e.message, "", 1800);
            setLoading(false);
          }
        } else {
          NotificationManager.error("Something went wrong", "", 1800);
          setLoading(false);
        }
      }
    }
  };

  const deployCollection = async (coll) => {
    let res1;
    let creator;
    setLoading(true);
    try {
      creator = await exportInstance(contracts.CREATOR_PROXY, degnrABI);
      console.log("creator is---->", creator);
      console.log("create collection is called");
      console.log("contracts usdt address", contracts.USDT);
    } catch (e) {
      console.log("err", e);
      setLoading(false);
      return;
    }
    try {
      coll.type == "1"
        ? (res1 = await creator.deployExtendedERC721(
            coll.name,
            coll.symbol,
            "www.uri.com",
            coll.royalityPercentage,
            coll.preSaleTokenAddress
          ))
        : (res1 = await creator.deployExtendedERC1155(
            "www.uri.com",
            coll.royalityPercentage,
            coll.preSaleTokenAddress
          ));
      let hash = res1;
      res1 = await res1.wait();
      let contractAddress = await readReceipt(hash);

      console.log("res1 is--->", res1);

      console.log("contract address is--->", contractAddress);
      let fd = new FormData();
      fd.append("id", coll._id);
      fd.append("contractAddress", contractAddress);
      fd.append("isDeployed", 1);
      await UpdateCollection(fd);
    } catch (e) {
      console.log(e);
      NotificationManager.error(e.message, "", 1500);
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/createcollection";
      }, 1000);
    }
  };

  const handleImportNFT = async (isNew) => {
    window.sessionStorage.setItem("importLink", importedCollectionLink);
    let res;
    try {
      const token = await exportInstance(importedAddress, abi);
      let originalSupply = await token.totalSupply();
      let dbSupply;
      if (isNew) {
        let collection = await getAllCollections({
          contractAddress: importedAddress.toLowerCase(),
        });
        console.log("collections", collection);
        if (collection.count < 1) {
          var fd = new FormData();

          fd.append("isDeployed", 1);
          fd.append("isImported", 1);
          fd.append("isOnMarketplace", 1);
          fd.append("name", title);
          fd.append("contractAddress", importedAddress.toLowerCase());
          fd.append("totalSupply", parseInt(originalSupply));

          res = await createCollection(fd);
          console.log("coll create", res._id);

          try {
            let _nfts = await getNFTList({
              page: 1,
              limit: 12,
              collectionID: res._id,
              searchText: "",
            });
            console.log("res", _nfts);

            let nftCount = _nfts.length;
            dbSupply = parseInt(nftCount);

            await importCollection({
              address: importedAddress,
              totalSupply: parseInt(originalSupply)
                ? parseInt(originalSupply)
                : 0,
              name: title,
            });
          } catch (e) {
            console.log("error", e);
            return;
          }
        } else {
          NotificationManager.error("Collection already imported", "", 800);
        }
      } else {
        let fd = new FormData();
        fd.append("contractAddress", importedAddress.toLowerCase());
        fd.append("link", importedCollectionLink);
        fd.append("isDeployed", 1);
        fd.append("id", selectedCollectionId);
        fd.append("isOnMarketplace", 1);
        fd.append("isImported", 1);
        fd.append("totalSupply", parseInt(originalSupply));
        res = await UpdateCollection(fd);

        let _nfts = await getNFTList({
          page: 1,
          limit: 12,
          collectionID: res._id,
          searchText: "",
        });
        console.log("res", _nfts);

        let nftCount = _nfts.length;
        dbSupply = parseInt(nftCount);
        console.log("coll update", res._id);
      }

      for (let i = dbSupply; i < parseInt(originalSupply); i++) {
        let tokenId = await token.tokenByIndex(i);
        console.log("tokenId", tokenId);
        try {
          let uri = await token.tokenURI(tokenId);
          console.log("uri", uri);
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
          resp.collectionID = res._id;
          resp.totalQuantity = 1;
          console.log("resp", resp);
          await createNft({ nftData: resp });
        } catch (e) {
          console.log("error", e);
          continue;
        }
      }
    } catch (e) {
      console.log("error", e);
      return;
    }
  };

  const setShowOnMarketplace = async (id, show) => {
    setLoading(true);
    try {
      let fd = new FormData();

      fd.append("id", id);
      fd.append("isOnMarketplace", show);

      await UpdateCollection(fd);

      // setTimeout(() => {
      //   window.location.href = "/createcollection";
      // }, 1000);
    } catch (e) {
      console.log(e);
      NotificationManager.error(e.message, "", 1500);
      setLoading(false);
      // setTimeout(() => {
      //   window.location.href = "/createcollection";
      // }, 1000);
    }
  };

  const handleEditCollection = async () => {
    try {
      const reqData = {
        page: 1,
        limit: 1,
        collectionID: selectedCollectionId,
      };
      const res1 = await getAllCollections(reqData);
      const res2 = res1.results[0][0];
      setTitle(res2.name);
      setRoyalty(res2.royalityPercentage);
      setPreSaleStartTime(res2.preSaleStartTime);
      setDatetime2(res2.preSaleEndTime);
      setMaxSupply(res2.totalSupply);
      setPrice(res2.price?.$numberDecimal);
      setCategory(res2.categoryID?.name);
      setBrand(res2.brandID?.name);
      setDescription(res2.description);
      setSymbol(res2.symbol);
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
      NotificationManager.success("Collection updated", "", 1000);
      setReloadContent(!reloadContent);
    } catch (e) {
      console.log("Error", e);
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
            data-bs-target="#exampleModal"
            onClick={() => setModal("active")}
          >
            + Add Collection
          </button>
        </div>
        <div className="add_btn mb-4 d-flex justify-content-end">
          <button
            className="btn btn-admin text-light"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal2"
            onClick={() => setNewImportModal("active")}
          >
            + Import Collection
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
          <table className="table table-hover text-light">
            <thead>
              <br></br>
              <tr>
                <th>Collection</th>
                <th>Title</th>
                <th>Symbol</th>
                <th>Description</th>
                <th>Royalty</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Max Supply</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
              </tr>
            </thead>
            <br></br>
            {myCollections &&
            myCollections != undefined &&
            myCollections != "" &&
            myCollections.length > 0
              ? myCollections.map((item, index) => {
                  return (
                    <tbody>
                      <tr>
                        <td>
                          {" "}
                          <img
                            src={item.logoImage}
                            className="profile_i m-2"
                            alt=""
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.symbol}</td>
                        <td>{item.description}</td>
                        <td>{item.royalityPercentage}</td>
                        <td>
                          {item.preSaleStartTime
                            ? moment(item.preSaleStartTime).format(
                                "MMMM Do YYYY"
                              )
                            : "-"}
                        </td>
                        <td>
                          {item.preSaleEndTime
                            ? moment(item.preSaleEndTime).format("MMMM Do YYYY")
                            : "-"}
                        </td>
                        <td>{item.totalSupply}</td>
                        <td>
                          {Number(
                            convertToEth(item.price.$numberDecimal)
                          ).toFixed(4)}
                        </td>
                        <td>{item.categoryID?.name}</td>
                        <td>{item.brandID?.name}</td>
                      </tr>

                      <div className="btn_container">
                        {item.isImported === 0 ? (
                          <button
                            className="btn btn-admin m-1 p-1 text-light"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal1"
                            type="button"
                            onClick={async () => {
                              setSelectedCollectionId(item._id);
                              setImportModal(true);
                            }}
                          >
                            Import
                          </button>
                        ) : (
                          ""
                        )}
                        <button
                          className="btn btn-admin m-1 p-1 text-light "
                          type="button"
                          onClick={async () => {
                            item.isOnMarketplace === 0
                              ? await setShowOnMarketplace(item._id, 1)
                              : await setShowOnMarketplace(item._id, 0);
                          }}
                        >
                          {item.isOnMarketplace === 0 ? "Show" : "Hide"}
                        </button>

                        <button
                          className="btn btn-admin m-1 p-1 text-light"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          onClick={async () => {
                            setSelectedCollectionId(item._id);
                            setIsEditModal("active");
                            handleEditCollection();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn btn-admin m-1 p-1 exclusive-btn ${
                            item.isExclusive ? "active" : ""
                          }`}
                          type="button"
                          onClick={() =>
                            handleCollection(
                              item._id,
                              "isExclusive",
                              !item.isExclusive ? 1 : 0
                            )
                          }
                        >
                          Exclusive Collection
                        </button>
                        <button
                          className={`btn btn-admin m-1 p-1 hot-btn ${
                            item.isHotCollection ? "active" : ""
                          }`}
                          type="button"
                          onClick={() =>
                            handleCollection(
                              item._id,
                              "isHotCollection",
                              !item.isHotCollection ? 1 : 0
                            )
                          }
                        >
                          Hot Collection
                        </button>
                      </div>
                    </tbody>
                  );
                })
              : "No Collections Found"}
          </table>
        </div>
      </div>

      <div
        className={`modal fade createNft ${isModal}`}
        id="exampleModal"
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
                Create New Collection
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
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6 mb-1">
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
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={(preSaleStartTime || "").toString().substring(0, 16)}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    End Date *
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
                    Max Supply *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={maxSupply}
                    onChange={(e) => {
                      let maxSupply = parseInt(e.target.value, 10);
                      console.log(
                        "max supply is-->",
                        e.target.value,
                        typeof maxSupply
                      );
                      setMaxSupply(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (!/^\d*?\d*$/.test(e.key)) e.preventDefault();
                    }}
                  />
                </div>
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Price *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={price}
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
                    class="form-select"
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
                    class="form-select"
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
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Minting Link *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    name="title"
                    value={importedCollectionLink}
                    onChange={(e) => {
                      setImportedCollectionLink(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    NFT Type *
                  </label>
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    value={nftType}
                    onChange={(e) => setNftType(e.target.value)}
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">Single</option>;
                    <option value="2">Multiple</option>;
                  </select>
                </div>

                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    OffChain
                  </label>
                  <select
                    class="form-select"
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
                    class="form-select"
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
                    onChange={(e) => {
                      setImportedAddress(e.target.value);
                    }}
                  />
                </div>

                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Collection Link *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={importedCollectionLink}
                    name="address"
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
                    onChange={(e) => {
                      setImportedAddress(e.target.value);
                    }}
                  />
                </div>

                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Collection Link *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={importedCollectionLink}
                    name="address"
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
        className={`modal fade createNft ${isEditModal}`}
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
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="col-md-6 mb-1">
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
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={(preSaleStartTime || "").toString().substring(0, 16)}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    End Date *
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
                    Max Supply *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={maxSupply}
                    onChange={(e) => {
                      let maxSupply = parseInt(e.target.value, 10);
                      console.log(
                        "max supply is-->",
                        e.target.value,
                        typeof maxSupply
                      );
                      setMaxSupply(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (!/^\d*?\d*$/.test(e.key)) e.preventDefault();
                    }}
                  />
                </div>
                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    Price *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-name"
                    value={price}
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
                    class="form-select"
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
                    class="form-select"
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

                <div className="col-md-6 mb-1">
                  <label for="recipient-name" className="col-form-label">
                    NFT Type *
                  </label>
                  <select
                    class="form-select"
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
  );
}

export default CreateCollection;
