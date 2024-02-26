import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
import {
  Algo,
  OfflineDirectSigner,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import {
  BroadcastMode,
  ChainRecord,
  ExtendedHttpEndpoint,
  SignType,
  SuggestToken,
  WalletAccount,
} from "@cosmos-kit/core";
import { DirectSignDoc, SignOptions, WalletClient } from "@cosmos-kit/core";

import { Xion } from "./types";
import { GranteeSignerClient } from "@burnt-labs/abstraxion-core";
import { AADirectSigner, AASigner } from "@burnt-labs/signers";
import { DirectSignResponse } from "@cosmjs/proto-signing";

export class XionClient implements WalletClient {
  readonly client: Xion;
  readonly granteeSignerClient: GranteeSignerClient;
  readonly aaClient: AASigner;

  private _defaultSignOptions: SignOptions = {
    preferNoSetFee: false,
    preferNoSetMemo: true,
    disableBalanceCheck: true,
  };

  get defaultSignOptions() {
    return this._defaultSignOptions;
  }

  setDefaultSignOptions(options: SignOptions) {
    this._defaultSignOptions = options;
  }

  constructor(client: Xion, granteeSignerClient: GranteeSignerClient) {
    // default signingCosmwasmClient
    this.client = client;
    // granteeSignerClient
    this.granteeSignerClient = granteeSignerClient;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async suggestToken({ chainId, tokens, type }: SuggestToken) {
    if (type === "cw20") {
      for (const { contractAddress } of tokens) {
        await this.client.suggestCW20Token(chainId, contractAddress);
      }
    }
  }

  // TODO: remove, no chain other than Burnt
  async addChain(chainInfo: ChainRecord) {
    const suggestChain = chainRegistryChainToKeplr(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );

    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      (suggestChain.rest as string | ExtendedHttpEndpoint) =
        chainInfo.preferredEndpoints?.rest?.[0];
    }

    if (chainInfo.preferredEndpoints?.rpc?.[0]) {
      (suggestChain.rpc as string | ExtendedHttpEndpoint) =
        chainInfo.preferredEndpoints?.rpc?.[0];
    }

    await this.client.experimentalSuggestChain(suggestChain);
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address,
      username,
    };
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    // only direct offline signer for now
    if (preferredSignType !== "direct") {
      throw new Error("Only direct signer is supported");
    }
    return this.getOfflineSignerDirect(chainId);
  }

  getOfflineSignerDirect(chainId: string): OfflineDirectSigner {
    return {
      getAccounts: async () => [await this.getAccount(chainId)],
      signDirect: async (signer, signDoc) => {
        return this.signDirect(chainId, signer, signDoc);
      },
    };
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const { address, pubkey } = await this.granteeSignerClient.getAccount(
      chainId
    );
    return {
      address,
      algo: "secp256k1",
      pubkey: pubkey.value,
    };
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc
  ): Promise<DirectSignResponse> {
    return this.aaClient.signDirect(signer, {
      ...signDoc,
      accountNumber: signDoc.accountNumber,
    });
  }
}
