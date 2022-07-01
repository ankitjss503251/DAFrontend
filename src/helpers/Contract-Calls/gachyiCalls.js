import { msgTrigger } from "../../components/components/MintEventSlider";
import { MAX_ALLOWANCE_AMOUNT } from "../constants";
import erc20Abi from "../../config/abis/erc20.json";
import gooAbi from "../../config/abis/gachiyland.json"
import { exportInstance } from "../../apiServices";
import contracts from "../../config/contracts";

const cID=0;
export const fetchInfo = async () => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let categories = await gooContract.categories(cID)
      let totalSupply = await gooContract.totalSupply();
      return [categories.price,categories.token,totalSupply] ;
      return categories;
    } catch (e) {
      return e;
    }
  
  };
  export const testMint = async ( qty,price,from) => {
    price = parseFloat(price) * parseInt(qty);
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let result  = await gooContract.estimateGas.mintTokens(cID, qty, { from: from})
      return result;
    } catch (e) {
      if(JSON.stringify(e).includes("insufficient allowance")){
        let getcateg = await fetchInfo(0);
         let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
         let bal = await erc20.balanceOf(from);
         if(parseFloat(bal)>price){
          //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
          try {
            let txn  = await erc20.approve(contracts.gachyiland,"1000000000000000000",{from:from})
            msgTrigger("approval initiated :");
            txn = await txn.wait()
            msgTrigger.log("approval succeed ",txn);
            return txn;
            
          } catch (error) {
            return false;
          }
         }else{
          return "not enough balance";
         }
      }
    }
  }
  export const mintTokens = async ( qty, from) => {
    let gooContract = await exportInstance(contracts.gachyiland, gooAbi.abi);
    try {
      let result  = await gooContract.mintTokens(cID, qty, { from: from})
      msgTrigger("txn initiated :");
      return result;
    } catch (e) {
      return e;
    }
  
  };