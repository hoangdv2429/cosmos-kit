import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";

import { ChainXionExtension } from "./chain-wallet";
import { XionClient } from "./client";
import { getXionFromExtension } from "./utils";

export class XionExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainXionExtension);
  }

  async initClient() {
    this.initingClient();
    try {
      // get the Xion-wallet from the web after signin/signup
      const xion = await getXionFromExtension();
      // TODO: init GranteeSignerClient
      const granteeSignerClient = undefined;
      // const granteeSignerClient = this.getGranteeSignerClient();
      this.initClientDone(
        xion ? new XionClient(xion, granteeSignerClient) : undefined
      );
    } catch (error) {
      this.initClientError(error);
    }
  }
}
