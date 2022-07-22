import { ethers } from "ethers";
import Web3 from "web3";
import API from "./helpers/apiClient";
import { setCookie, isSuperAdmin, deleteIsAdmin } from "./helpers/utils";
const web3 = new Web3(
  "https://polygon-mumbai.g.alchemy.com/v2/8RAii8kDi0Fwe47iF1_WLjpcSfp3q3R6"
);

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

export const exportInstanceThroughWeb3 = async (SCAddress, ABI) => {
  let contract = new web3.eth.Contract(ABI, SCAddress);

  if (contract) {
    return contract;
  } else {
    return {};
  }
};

export const adminRegister = async (account) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: account,
    }),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/auth/adminregister",
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
    console.error("There was an error!", error);
  }
};

export const Login = async (account) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: account,
    }),
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/auth/adminlogin",
      requestOptions
    );

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson && (await response.json());
    // check for error response
    // if (!response.ok) {
    //   // get error message from body or default to response status
    //   const error = (data && data.message) || response.status;
    //   return Promise.reject(error);
    // }
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
  const response = await fetch(
    process.env.REACT_APP_API_BASE_URL + "/user/Profile",
    {
      headers: { Authorization: getHeaders() },
    }
  );
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson && (await response.json());
  return data;
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
    return data;
  } catch (err) {
    return err;
  }
};

export const updateProfile = async (account, data) => {
  let formData = new FormData();

  formData.append("sUserName", data.uname ? data.uname : "");
  formData.append("sFirstname", data.fname ? data.fname : "");
  formData.append("sLastname", data.lname ? data.lname : "");
  formData.append("sBio", data.bio ? data.bio : "");
  formData.append("sWebsite", data.website ? data.website : "");
  formData.append("sEmail", data.email ? data.email : "");
  formData.append("sWalletAddress", account);
  formData.append("userProfile", data.profilePic ? data.profilePic : "");

  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: localStorage.getItem("Authorization"),
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

export const createCollection = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("Authorization"),
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
    return datas.data;
  } catch (err) {
    return err;
  }
};

export const UpdateCollection = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
    body: data,
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/updateCollection",
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

export const getAllCollections = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

export const GetMyCollectionsList = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body: JSON.stringify(data),
  };

  try {
    let url = isSuperAdmin() ? "allCollections" : "myCollections";
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + `/nft/${url}`,
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
      Authorization: localStorage.getItem("Authorization"),
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

export const GetMyNftList = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/myNFTs",
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

export const addBrand = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    },
    body: data,
  };
  try {
   

    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/utils/addBrand",
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

export const GetBrand = async (id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("Authorization"),
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
    if (datas.data) return datas.data;
    return [];
  } catch (err) {
    return err;
  }
};

export const createNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    },
    body: data,
  };

  try {
    

    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/createNFT",
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

export const addCategory = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
    },
    body: data,
  };
  try {
   
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/utils/addCategory",
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

export const getCategory = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: getAuthorization(),
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
    if (datas.data) return datas.data;
    return [];
  } catch (err) {
    return err;
  }
};

export const createOrder = async (data, isImported) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("Authorization"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response;

    response = await fetch(
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

export const importCollection = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/import/createCollection",
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

export const importNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/nft/importNFT",
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

// export const getImportedNFTs = async (data) => {
//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   };

//   try {
//     let response = await fetch(
//       process.env.REACT_APP_API_BASE_URL + "/import/getNFT",
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

export const getImportedCollections = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/import/getImportedCollection",
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

export const UpdateImportedNft = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/import/updateNFT",
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

export const DeleteOrder = async (data) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
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

export const UpdateOrderStatus = async (data) => {
  const requestOptions = {
    method: "PUT",

    headers: {
      Authorization: localStorage.getItem("Authorization"),
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

export const GetOrdersByNftId = async (data) => {
  //   {
  //     "nftId": "6229812aa2c3ed3120651ca6",
  //     "sortKey": "oTokenId",
  //     "sortType": -1,
  //     "page": 1,
  //     "limit": 4
  // }

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
function getAuthorization() {
  return getHeaders() || isSuperAdmin();
}
export { isSuperAdmin };

export const adminLogin = ({ username, password }) => {
  return API.post("/auth/superAdminLogin", { username, password }).then(
    (res) => {
      let { token } = res?.data;
      setCookie("connect.auth", token, 100);
      setCookie("selected_account", "superadmin", 100);

      return res;
    }
  );
};
export function logoutSuperAdmin() {
  deleteIsAdmin();
}
export const adminUsers = (page) => {
  let limit = 12;
  return API.addHeaders({ Authorization: getAuthorization() }).post(
    "/auth/allAdmin",
    { page, limit }
  );
};
export const blockUnBlockAdmin = (adminID, blockStatus) => {
  return API.addHeaders({ Authorization: getAuthorization() }).post(
    "/auth/blockUnblockAdmin",
    { adminID, blockStatus }
  );
};
export const saveAdminUser = (form, id) => {
  let url = id ? "updateAdmin" : "addAdmin";
  return API.addHeaders({ Authorization: getAuthorization() }).post(
    `/auth/${url}`,
    form,
    true
  );
};
export const blockUnBlockCollection = (collectionID, blockStatus) => {
  return API.addHeaders({ Authorization: getAuthorization() }).post(
    "/nft/blockUnblockCollection",
    { collectionID, blockStatus }
  );
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

export const UpdateTokenCount = async (data) => {
  const requestOptions = {
    method: "GET",
  };
  try {
    let response = await fetch(
      process.env.REACT_APP_API_BASE_URL + `/nft/updateCollectionToken/${data}`,
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

