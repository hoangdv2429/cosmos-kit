import { CosmWasmClient, SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SigningStargateClientOptions, StargateClient, StargateClientOptions, StdFee } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Callbacks, ChainRecord, ChainWalletData, CosmosClientType, SessionOptions, Wallet, WalletClient } from '../types';
import { WalletBase } from './wallet';
export declare class ChainWalletBase extends WalletBase<ChainWalletData> {
    protected _chainRecord: ChainRecord;
    rpcEndpoints?: string[];
    restEndpoints?: string[];
    protected _rpcEndpoint?: string;
    protected _restEndpoint?: string;
    constructor(walletInfo: Wallet, chainRecord: ChainRecord);
    get chainRecord(): ChainRecord;
    get chainName(): string;
    get chainLogoUrl(): string | undefined;
    get stargateOptions(): StargateClientOptions | undefined;
    get signingStargateOptions(): SigningStargateClientOptions | undefined;
    get signingCosmwasmOptions(): SigningCosmWasmClientOptions | undefined;
    get chain(): import("@chain-registry/types").Chain;
    get assets(): import("@chain-registry/types").Asset[];
    get assetList(): import("@chain-registry/types").AssetList;
    get chainId(): string;
    get cosmwasmEnabled(): boolean;
    get username(): string | undefined;
    get address(): string | undefined;
    get offlineSigner(): OfflineSigner | undefined;
    fetchClient(): WalletClient | Promise<WalletClient | undefined> | undefined;
    update(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    getRpcEndpoint: () => Promise<string>;
    getRestEndpoint: () => Promise<string>;
    getStargateClient: () => Promise<StargateClient>;
    getCosmWasmClient: () => Promise<CosmWasmClient | undefined>;
    getSigningStargateClient: () => Promise<SigningStargateClient>;
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;
    protected getSigningClient: (type?: CosmosClientType) => Promise<SigningStargateClient | SigningCosmWasmClient>;
    estimateFee: (messages: EncodeObject[], type?: CosmosClientType, memo?: string, multiplier?: number) => Promise<StdFee>;
    sign: (messages: EncodeObject[], fee?: StdFee | number, memo?: string, type?: CosmosClientType) => Promise<TxRaw>;
    broadcast: (signedMessages: TxRaw, type?: CosmosClientType) => Promise<import("@cosmjs/cosmwasm-stargate").DeliverTxResponse>;
    signAndBroadcast: (messages: EncodeObject[], fee?: StdFee | number, memo?: string, type?: CosmosClientType) => Promise<import("@cosmjs/cosmwasm-stargate").DeliverTxResponse>;
}
