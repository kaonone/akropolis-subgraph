import { Address, log } from "@graphprotocol/graph-ts";

import { YEarnVault } from "../../../generated/schema";

export function loadVault(poolAddress: Address): YEarnVault {
  let pool = YEarnVault.load(poolAddress.toHex());

  if (!pool) {
    log.error("Vault Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Vault Pool not found");
  }

  return pool as YEarnVault;
}
