import { exportInstance } from "../apiServices";
const RRbabyAbi = require("../config/abis/rrbaby.json");
const ethers = require('ethers');
const privateKey = process.env.REACT_APP_PRIVATE_KEY

export const sigGenerator= async (uAddress,cAddress)=>{
    console.log("siggen");
    let contract = await exportInstance(cAddress, RRbabyAbi.abi);
    const cNonce = await contract.nonces(uAddress);
     const wallet = new ethers.Wallet(privateKey);     
    const packedData = ethers.utils.solidityPack(
        ["address", "uint256", "uint256"],
        [uAddress, 2, cNonce.toString()]
      );
    const signature = await wallet.signMessage(
        ethers.utils.arrayify(packedData)
    );
    let UserSignature = {
        uAddress: uAddress,
        uSignature:signature, 
    };
    console.log(UserSignature.uSignature);
    return UserSignature;
} 

