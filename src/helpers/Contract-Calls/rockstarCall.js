
import { MAX_ALLOWANCE_AMOUNT } from "../constants";
import erc20Abi from "../../config/abis/erc20.json";
import rrBabyAbi from "../../config/abis/rrbaby.json"
import { exportInstance } from "../../apiServices";
import contracts from "../../config/contracts";
import { convertToEth } from "../../helpers/numberFormatter";
import BigNumber from "bignumber.js";
import evt from "../../events/events";
import {isWhitelisted} from "../../apiServices"



export const fetchInfo = async () => {

    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
      let price = await contract.price();
      let token =await  contract.token();
      let totalSupply = await contract.indicatesID();
      // console.log("came from rockstar",price,token,(totalSupply-1));
      return [price,token,(totalSupply-1)];
     
    } catch (e) {
      return e;
    }
  
  };
  export const testMint = async ( qty, price,from) => {
    evt.emit('txn-status',"initiate loader");
    price = parseFloat(price) * parseInt(qty);
    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
      let result = await contract.isActive();
      if(result){
            // public mint
    try {
      let result  = await contract.estimateGas.mintTokens( qty, { from: from })
         if(result) {return mintTokens(qty,from)}
    } catch (e) {
      if(JSON.stringify(e).includes("insufficient allowance")){
        let getcateg = await fetchInfo();
         let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
         let bal = await erc20.balanceOf(from);
         bal =convertToEth(new BigNumber(bal.toString()));
         console.log("Balance of user :",bal);
         if(parseFloat(bal)>price){
          //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
          try {
            let txn  = await erc20.approve(contracts.rrBaby,"80000000000000000",{from:from})
            evt.emit('txn-status',"approval-initiated");
            txn = await txn.wait()
            evt.emit('txn-status',"approval-succeed");
            if(txn) {return mintTokens(qty,from)}
            return [txn,true];
            
          } catch (error) {
            evt.emit('txn-error',"user-denied-approval");
            return [error,false];
          }
         }else{
          evt.emit('txn-error',"not enough balance");
          return ["not enough balance",false];
         }
        
      }
      if(JSON.stringify(e).includes("transfer amount exceeds balance")){
        console.log("no money");
        evt.emit('txn-error',"not enough balance");
        return ["not enough balance",false];
      }else{
        evt.emit('txn-error',e.reason);
      }
    }
    // public mint ends here
      }else{

      let isEligible =await  isWhitelisted({address:from})

       if(isEligible.auth){  
            let maxQty=2
        
      try {
        console.log("trying whitelist mint",isEligible.signature);
        let result  = await contract.estimateGas.whitelistedMint( qty, maxQty,isEligible.signature, { from: from })

           if(result) {whitelistMint(qty, maxQty,isEligible.signature,from)}
      } catch (e) {
        console.log("whitelist errroorrrr",e );
        if(JSON.stringify(e).includes("insufficient allowance")){
          let getcateg = await fetchInfo();
           let erc20 = await exportInstance(getcateg[1].toString(), erc20Abi);
           let bal = await erc20.balanceOf(from);
           bal =convertToEth(new BigNumber(bal.toString()));
           console.log("Balance of user :",bal);
           if(parseFloat(bal)>price){
            //  let txn  = await erc20.approve(contracts.gachyiland,MAX_ALLOWANCE_AMOUNT,{from:from})
            try {
              let txn  = await erc20.approve(contracts.rrBaby,"80000000000000000",{from:from})
              evt.emit('txn-status',"approval-initiated");
              txn = await txn.wait()
              evt.emit('txn-status',"approval-succeed");
              if(txn) {return whitelistMint(qty, maxQty,isEligible.signature,from)}
              return [txn,true];
              
            } catch (error) {
              evt.emit('txn-error',"user-denied-approval");
              return [error,false];
            }
           }else{
            evt.emit('txn-error',"not enough balance");
            return ["not enough balance",false];
           }
          
        }
        if(JSON.stringify(e).includes("transfer amount exceeds balance")){
          console.log("no money");
          evt.emit('txn-error',"not enough balance");
          return ["not enough balance",false];
        }else{
          evt.emit('txn-error',e.reason);
          return e
        }
      }


         }else{
          evt.emit('txn-error',"address not Whitelisted");
          return "address not Whitelisted";
         }
      }
    } catch (error) {
      
    }

  }
   const mintTokens = async ( qty, from) => {
    evt.emit('txn-status',"mint-initiated");
    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
      let txn  = await contract.mintTokens( qty, { from:from})
      txn = await txn.wait()
      evt.emit('txn-status',"mint-succeed");
      return txn;
    } catch (e) {
      evt.emit('txn-error',"user-denied-mint");
      return e;
    }
  };
  const whitelistMint = async ( qty,maxQty,sig, from) => {
    evt.emit('txn-status',"mint-initiated");
    let contract = await exportInstance(contracts.rrBaby, rrBabyAbi.abi);
    try {
      let txn  = await contract.whitelistedMint( qty, maxQty,sig, { from: from })
      txn = await txn.wait()
      evt.emit('txn-status',"mint-succeed");
      return txn;
    } catch (e) {
      evt.emit('txn-error',"user-denied-mint");
      return e;
    }
  };