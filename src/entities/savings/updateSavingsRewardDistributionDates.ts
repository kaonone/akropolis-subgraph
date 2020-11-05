import { Address, ethereum } from "@graphprotocol/graph-ts";

import { loadSavingsPool } from ".";

export function updateSavingsRewardDistributionDates(
  event: ethereum.Event,
  poolAddress: Address
): void {
  let pool = loadSavingsPool(poolAddress);

  if (pool.lastRewardDistributionDate.equals(event.block.timestamp)) {
    return;
  }

  pool.prevRewardDistributionDate = pool.lastRewardDistributionDate;
  pool.lastRewardDistributionDate = event.block.timestamp;

  pool.save();
}
