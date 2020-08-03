import { Address, log } from "@graphprotocol/graph-ts";

import { SavingsPool } from "../../generated/schema";

export function loadSavingsPool(poolAddress: Address): SavingsPool {
  let pool = SavingsPool.load(poolAddress.toHex());

  if (!pool) {
    log.error("Savings Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Savings Pool not found");
  }

  return pool as SavingsPool;
}
