import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
import { Algo, OfflineSigner } from "@cosmjs/proto-signing";
import {
  BroadcastMode,
  ChainRecord,
  ExtendedHttpEndpoint,
  SignType,
  SuggestToken,
} from "@cosmos-kit/core";
import { DirectSignDoc, SignOptions, WalletClient } from "@cosmos-kit/core";

import { Xion } from "./types";
import { GranteeSignerClient } from "@burnt-labs/abstraxion-core";
import { AADirectSigner, AASigner } from "@burnt-labs/signers";
import { DirectSignResponse } from "@cosmjs/proto-signing";

export class XionClient implements WalletClient {
  readonly client: Xion;
  readonly granteeSignerClient: GranteeSignerClient;
  readonly AASigner: AADirectSigner;

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

  async getAccount(chainId: string) {
    const key = await this.client.getKey(chainId);
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo as Algo,
      pubkey: key.pubKey,
      isNanoLedger: key.isNanoLedger,
    };
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    // only direct offline signer for now
    return this.AASigner.signer as OfflineSigner;
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<DirectSignResponse> {
    return this.AASigner.signDirect(signer, {
      ...signDoc,
      accountNumber: signDoc.accountNumber,
    });
  }
}
