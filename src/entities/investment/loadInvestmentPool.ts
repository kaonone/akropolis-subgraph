import { Address, log } from "@graphprotocol/graph-ts";

import { InvestmentPool } from "../../../generated/schema";

export function loadInvestmentPool(poolAddress: Address): InvestmentPool {
  let pool = InvestmentPool.load(poolAddress.toHex());

  if (!pool) {
    log.error("Savings Pool with address {} not found", [poolAddress.toHex()]);
    throw new Error("Savings Pool not found");
  }

  return pool as InvestmentPool;
}
