
import { onboard } from "../menu/header";

export const WalletConditions = () => {
    const cookies = document.cookie;
    let str = cookies;

    str = str.split('; ');
    const result = {};
    for (let i in str) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }

    if (result.selected_account === undefined || result.selected_account === "") {
        return "notConnected";

    }

    const state = onboard.state.get();

    if (state.wallets?.length > 0) {
        console.log("state", state)
        const cWalletAccount = state.wallets[0].accounts[0].address;
        const cWalletChainID = state.wallets[0].chains[0].id;

        if (cWalletChainID !== result.chain_id) {
            return "chainId";

        }
        else
            if (cWalletAccount !== result.selected_account) {
                return "account";

            }


    }
    else {
        return "locked";

    }



}

