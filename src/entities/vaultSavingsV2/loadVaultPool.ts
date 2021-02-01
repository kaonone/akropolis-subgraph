import { Address, log } from "@graphprotocol/graph-ts";

import { VaultPoolV2 } from "../../../generated/schema";

export function loadVaultPoolV2(poolAddress: Address): VaultPoolV2 {
  let pool = VaultPoolV2.load(poolAddress.toHex());

  if (!pool) {
    log.error("Vault Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Vault Pool not found");
  }

  return pool as VaultPoolV2;
}
