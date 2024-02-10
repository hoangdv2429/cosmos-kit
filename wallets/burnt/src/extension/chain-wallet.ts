import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';

export class ChainXionExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
