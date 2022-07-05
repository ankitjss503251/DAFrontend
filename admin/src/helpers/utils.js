const ethers = require("ethers");
const abi = [
  "event Transfer(address indexed src, address indexed dst, uint val)",
];
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/FUQcHbEDjESH5An4BhSuv5Y0HuXcD7A6"
);

export const getEvents = async (tokenAddress) => {
  console.log("tokenAdd", tokenAddress);
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

  console.log("data", events.length);
};
