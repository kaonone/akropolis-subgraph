import { Address, log } from "@graphprotocol/graph-ts";

import { Vault } from "../../../generated/schema";

export function loadVault(poolAddress: Address): Vault {
  let pool = Vault.load(poolAddress.toHex());

  if (!pool) {
    log.error("Vault Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Vault Pool not found");
  }

  return pool as Vault;
}
