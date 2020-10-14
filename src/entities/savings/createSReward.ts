import { SReward } from "../../../generated/schema";
import { RewardDistribution } from "../../../generated/SavingsModule/SavingsModule";
import { getUniqId } from "../../utils";
import { Address } from "@graphprotocol/graph-ts";
import { loadSavingsPool } from "./loadSavingsPool";

export function createSReward(
  event: RewardDistribution,
  poolAddress: Address
): void {
  let pool = loadSavingsPool(poolAddress);

  let reward = new SReward(getUniqId(event));
  reward.pool = poolAddress.toHex();
  reward.poolBalance = pool.balance;
  reward.duration = event.block.timestamp.minus(pool.prevRewardDistributionDate)
  reward.token = event.params.rewardRoken.toHex();
  reward.amount = event.params.amount;
  reward.date = event.block.timestamp;

  reward.save();
}
