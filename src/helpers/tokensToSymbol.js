import contracts from "../config/contracts";
import USDTSymbol from "./../assets/images/usdt.png";
import BNBSymbol from "./../assets/images/bnb.png";
import HNTRSymbol from "./../assets/images/hntr.png";

export const Tokens = {
  [contracts["USDT"].toLowerCase()]: USDTSymbol,
  [contracts["BNB"].toLowerCase()]: BNBSymbol,
  [contracts["HNTR"].toLowerCase()]: HNTRSymbol,
};
