import { Address, log } from "@graphprotocol/graph-ts";

import { VaultPoolV1 } from "../../../generated/schema";

export function loadVaultPoolV1(poolAddress: Address): VaultPoolV1 {
  let pool = VaultPoolV1.load(poolAddress.toHex());

  if (!pool) {
    log.error("Vault Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Vault Pool not found");
  }

  return pool as VaultPoolV1;
}
