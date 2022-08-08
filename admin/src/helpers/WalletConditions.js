
import { onboard } from "../components/Navbar";

export const WalletConditions = () => {
    const cookies = document.cookie;
    let str = cookies;

    str = str.split('; ');
    const result = {};
    for (let i in str) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }

    if (result.da_selected_account === undefined || result.da_selected_account === "") {
        return "notConnected";

    }
   
    const state = onboard.state.get();
   
    if (state.wallets?.length > 0) {
        const cWalletAccount = state.wallets[0].accounts[0].address;
        const cWalletChainID = state.wallets[0].chains[0].id;
        if (cWalletChainID !== process.env.REACT_APP_CHAIN_ID) {
            return "chainId";

        }
        else
            if (cWalletAccount !== result.da_selected_account) {
                return "account";

            }


    }
    else {
        return "locked";

    }



}

