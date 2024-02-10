import { Wallet } from "@cosmos-kit/core";

import { ICON } from "../constant";

export const xionExtensionInfo: Wallet = {
  name: "xion-extension",
  prettyName: "Xion",
  logo: ICON,
  mode: "extension",
  mobileDisabled: () =>
    !("xion" in window || /XionCosmos/i.test(navigator.userAgent)),
  rejectMessage: {
    source: "Request rejected",
  },
  connectEventNamesOnWindow: ["xion_keystorechange"],
  downloads: [],
};
