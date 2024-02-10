import { xionExtensionInfo, XionExtensionWallet } from './extension';

const xionExtension = new XionExtensionWallet(xionExtensionInfo);

export const wallets = [xionExtension];
