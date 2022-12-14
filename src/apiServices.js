import { ethers } from "ethers";

export const exportInstance = async (SCAddress, ABI) => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner();
  let a = new ethers.Contract(SCAddress, ABI, signer);

  if (a) {
    return a;
  } else {
    return {};
  }
};
export const FetchInstance = async (SCAddress, ABI) => {
  let provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_RPC_URL
  );
  let a = new ethers.Contract(SCAddress, ABI, provider);

  if (a) {
    return a;
  } else {
    return {};
  }
};

export const Register = async (account) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: account,
    }),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/auth/Register",
      requestOptions
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson && (await response.json());

    // check for error response
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    localStorage.setItem("Authorization", data.data.token);
    return data;
  } catch (error) {
    //   this.setState({ postId: data.id });

    // this.setState({ errorMessage: error.toString() });
    console.error("There was an error!", error);
  }
};

export const Login = async (account, signature, message) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: account,
      signature: signature,
      message: message
    }),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/auth/Login",
      requestOptions
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson && (await response.json());
    // check for error response
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    localStorage.setItem("Authorization", data.data.token);
    return data;
    //   this.setState({ postId: data.id });
  } catch (error) {
    // this.setState({ errorMessage: error.toString() });
    console.error("There was an error!", error);
  }
};

export const Logout = async () => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
  };
  const response = await fetch(
    process.env.REACT_APP_API_BASE_URL + "/auth/Logout",
    requestOptions
  );

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson && (await response.json());

  localStorage.removeItem("Authorization", data.data.token);
};

export const getProfile = async () => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/user/profile",
      {
        headers: { Authorization: getHeaders() },
      }
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson && (await response.json());

    return data;
  } catch (e) {
    console.log("error in profile", e);
  }
};

export const getHeaders = () => {
  let t = localStorage.getItem("Authorization");
  return t && t !== undefined ? t : "";
};

export const checkuseraddress = async (account) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: account,
    }),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/auth/checkuseraddress",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson && (await response.json());
    return data.message;
  } catch (err) {
    return err;
  }
};

export const updateProfile = async (data) => {
  // console.log("data in api iis------>", data);
  let formData = new FormData();

  formData.append("userName", data.uname ? data.uname : "");
  //formData.append("sFirstname", data.fname ? data.fname : "");
  //formData.append("sLastname", data.lname ? data.lname : "");
  formData.append("bio", data.bio ? data.bio : "");
  formData.append("website", data.website ? data.website : "");
  formData.append("email", data.email ? data.email : "");
  //formData.append("sWalletAddress", account);
  formData.append("userProfile", data.profilePic ? data.profilePic : "");

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: getHeaders(),
    },
    body: formData,
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/user/updateProfile",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.message;
  } catch (err) {
    return err;
  }
};

export const getNFTList = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/viewNFTs",
      requestOptions
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());

    return datas.data;
  } catch (err) {
    return err;
  }
};

export const viewNFTDetails = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/viewNFTDetails",
      requestOptions
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());

    return datas.data;
  } catch (err) {
    return err;
  }
};

export const createCollection = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: getHeaders(),
    },
    body: data,
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/createCollection",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.message;
  } catch (err) {
    return err;
  }
};

export const getAllCollections = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/getCollections",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const GetAllUserDetails = async () => {
  let searchData = {
    length: 8,
    start: 0,
    sTextsearch: "",
    sSellingType: "",
    sSortingType: "Recently Added",
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: localStorage.getItem("Authorization"),
    },
    body: JSON.stringify(searchData),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/user/allDetails",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const GetIndividualAuthorDetail = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL +
      `/user/getIndividualUser/${data.userID}`,
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const createOrder = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    console.log("put on marketplace");
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/order/createOrder",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());

    return datas;
  } catch (err) {
    return err;
  }
};

export const createOrderBuffer = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    console.log("create Order Buffer");
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/order/createOrderBuffer",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());

    return datas;
  } catch (err) {
    return err;
  }
};

export const getOrderDetails = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/order/getOrder",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const GetOrdersByNftId = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/order/getOrdersByNftId",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const UpdateOrder = async (data) => {
  const requestOptions = {
    method: "PUT",

    headers: {
      Authorization: getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/order/updateOrder",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const DeleteOrder = async (data) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/order/deleteOrder",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const GetOwnedNftList = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/getOwnedNFTList",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};
export const isWhitelisted = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/whitelist/fetchWhitelistedAddress",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const getBrandById = async (brandID) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + `/utils/showBrandByID/${brandID}`,
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const getCategories = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/utils/getCategory",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const GetCombinedNfts = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/getCombinedNfts",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const getAllBrands = async (data) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/utils/getAllBrand",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const createBidNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/createBidNft",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const createOfferNFT = async (data) => {
  console.log("data for createOfer is--->", data);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/createOffer",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());

    return datas.data;
  } catch (err) {
    return err;
  }
};

export const fetchBidNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/fetchBidNft",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const fetchOfferNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/fetchOfferNft",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    console.log("'error in offer-->", err);
    return err;
  }
};

export const acceptBid = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/acceptBidNft",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    if (datas.statusCode === 401) {
      console.log("Token expired")
    }
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const acceptOffer = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/acceptOfferNft",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const updateBidNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/bid/updateBidNft",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas;
  } catch (err) {
    return err;
  }
};

export const getOnSaleItems = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/getOnSaleItems",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data.results;
  } catch (err) {
    return err;
  }
};

export const getMintCollections = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/fetchMintAddress",
      requestOptions
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    if (datas.statusCode === 200) return datas.data;
    else return [];
  } catch (err) {
    return err;
  }
};

export const InsertHistory = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/history/insert",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    console.log("history data", datas.data);
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const GetHistory = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/history/fetchHistory",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const fetchOfferMade = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/fetchOfferMade",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const UpdateStatus = async (data, historyData, key) => {
  const requestOptions = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: getHeaders(),
    },
    body: JSON.stringify(data)
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/updateStatus",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    console.log("datas.statusCode", datas.statusCode)
    if (datas.statusCode !== 409 && historyData !== "" && historyData !== undefined && datas.statusCode !== 404) {
      await InsertHistory(historyData)
    }
    if (datas.statusCode === 409) {
      console.log("falsee")
      return false
    }
    return datas.data;
  } catch (err) {
    return err;
  }
};


export const fetchOfferReceived = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/fetchOfferReceived",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};


export const CheckIfBlocked = async (data) => {
  const requestOptions = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/user/checkIfBlocked",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());

    return datas.data;
  } catch (err) {
    return err;
  }
};

export const getCategoriesWithCollectionData = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/utils/getCategoryWithCollectionData",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const getAllCollectionTabs = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/utils/getCollections",
      requestOptions
    );
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const datas = isJson && (await response.json());
    return datas.data;
  } catch (err) {
    return err;
  }
};


// export const getUsersCollections = async () => {
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       Authorization: localStorage.getItem("Authorization"),
//     },
//   };
//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/collectionList",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     if (datas.data) return datas.data;
//     return [];
//   } catch (err) {
//     return err;
//   }
// };

// export const getCollectionWiseList = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   };
//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/allCollectionWiseList",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const Like = async () => {};

// export const GetOnSaleItems = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/getOnSaleItems",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetNftDetails = async (id) => {
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/viewnft/" + id,
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data ? datas.data : [];
//   } catch (err) {
//     return err;
//   }
// };

// export const SetNFTOrder = async (data) => {
//   try {
//     const requestOptions = {
//       method: "PUT",
//       headers: {
//         Authorization: localStorage.getItem("Authorization"),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     };

//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/setNFTOrder",
//       requestOptions
//     );
//     console.log("record updated", response);
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const LikeNft = async (data) => {
//   const requestOptions = {
//     method: "POST",

//     headers: {
//       Authorization: localStorage.getItem("Authorization"),
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/like",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetCollectionsByAddress = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL +
//         "/nft/getCollectionDetailsByAddress/",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetCollectionsById = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/getCollectionDetailsById/",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetMyNftList = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/getNFTList",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetMyCollectionsList = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: localStorage.getItem("Authorization"),
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/myCollectionList",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetMyLikedNft = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/getUserLikedNfts",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetMyOnSaleNft = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/getUserOnSaleNfts",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     console.log("dataaasss on sale", datas);
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const GetSearchedNft = async (data, owned = false) => {
//   console.log("Data", data);
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };
//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/nft/getSearchedNft",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.data;
//   } catch (err) {
//     return err;
//   }
// };

// export const Follow = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: localStorage.getItem("Authorization"),
//     },
//     body: JSON.stringify({ id: data }),
//   };
//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/user/follow",
//       requestOptions
//     );
//     const isJson = response.headers
//       .get("content-type")
//       ?.includes("application/json");
//     const datas = isJson && (await response.json());
//     return datas.message;
//   } catch (err) {
//     return err;
//   }
// };
