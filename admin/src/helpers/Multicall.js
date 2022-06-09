import contract from "./../config/contracts";
import MultiCallAbi from "./../config/abis/multicall.json";
import { Interface } from "@ethersproject/abi";
import Web3 from "web3";

const multicall = async (abi, calls) => {
  // console.log("MULTICALL ADDRESS");
  // console.log(getMulticallAddress());
  console.log("here11");
  const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/8RAii8kDi0Fwe47iF1_WLjpcSfp3q3R6");
  
  const multi = new web3.eth.Contract(MultiCallAbi, contract.MULTICALL);
  console.log("here22", multi);
  const itf = new Interface(abi);

  console.log("abi", abi, "calls", calls);
  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  console.log("here33");

  // console.log("Call Data");
  // console.log(calldata);

  const { returnData } = await multi.methods.aggregate(calldata).call();
 
  // console.log("Return data");
  // console.log(returnData);
  const res = returnData.map((call, i) =>
    itf.decodeFunctionResult(calls[i].name, call)
  );
  console.log("here44", res);
  return res;
};

export default multicall;
