import { ethers } from "ethers";
import contracts from "../config/contracts";

export const GENERAL_TIMESTAMP = 2214189165;
export const GENERAL_DATE = "01/03/2040";
export const CURRENCY = "ETH";
export const MAX_ALLOWANCE_AMOUNT = ethers.constants.MaxInt256;
// export const options = [{ value: contracts.BUSD, title: "BUSD" }];

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const MAX_WHITELIST_BUY_PER_USER=2