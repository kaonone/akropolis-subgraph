import { Address, log } from "@graphprotocol/graph-ts";

import { VaultPool } from "../../../generated/schema";

export function loadVaultPool(poolAddress: Address): VaultPool {
  let pool = VaultPool.load(poolAddress.toHex());

  if (!pool) {
    log.error("Vault Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Vault Pool not found");
  }

  return pool as VaultPool;
}
