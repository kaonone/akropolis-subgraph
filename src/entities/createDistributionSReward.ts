import { Address } from "@graphprotocol/graph-ts";

import { RewardDistribution } from "../../generated/RewardDistributionModule/RewardDistributionModule";
import { getUniqId } from "../utils";
import { loadSavingsPool } from "./savings/loadSavingsPool";
import { createSReward } from ".";

export function createDistributionSReward(
  event: RewardDistribution,
  poolAddress: Address
): void {
  let pool = loadSavingsPool(poolAddress);

  createSReward(
    poolAddress.toHex(),
    getUniqId(event),
    pool.balance,
    event.block.timestamp.minus(pool.prevRewardDistributionDate),
    event.params.rewardToken.toHex(),
    event.params.amount,
    event.block.timestamp
  );
}
