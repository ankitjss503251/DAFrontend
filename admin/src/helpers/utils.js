const ethers = require("ethers");
const abi = [
  "event Transfer(address indexed src, address indexed dst, uint val)",
];
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/FUQcHbEDjESH5An4BhSuv5Y0HuXcD7A6"
);

export const getEvents = async (tokenAddress) => {
  const contract = new ethers.Contract(
    tokenAddress,
    abi,
    provider
  );
  console.log("contract", contract);
  let eventFilter = contract.filters.Transfer(
    "0x0000000000000000000000000000000000000000",
    null,
    null
  );
  let events = await contract.queryFilter(eventFilter);
};
/******    Cookies         ******/
export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function deleteCookie(cname) {
  setCookie(cname, "", -1);
}
/******    Cookies  end       ******/
export function deleteIsAdmin() {
  deleteCookie('connect.auth');
  deleteCookie('selected_account');
}
export function isSuperAdmin() {
  return getCookie('connect.auth');
}

export function isLoggedIn() {
  return isSuperAdmin() || true;
}
export function isEmptyObject(obj) {
  return (
    Object.getPrototypeOf(obj) === Object.prototype &&
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  );
}