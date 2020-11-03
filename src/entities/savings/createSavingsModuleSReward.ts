import { Address } from "@graphprotocol/graph-ts";

import { RewardDistribution } from "../../../generated/SavingsModule/SavingsModule";
import { getUniqId } from "../../utils";
import { createSReward } from "../createSReward";
import { loadSavingsPool } from "./loadSavingsPool";

export function createSavingsModuleSReward(
  event: RewardDistribution,
  poolAddress: Address
): void {
  let pool = loadSavingsPool(poolAddress);

  createSReward(
    poolAddress.toHex(),
    getUniqId(event),
    pool.balance,
    event.block.timestamp.minus(pool.prevRewardDistributionDate),
    event.params.rewardRoken.toHex(),
    event.params.amount,
    event.block.timestamp
  );
}
