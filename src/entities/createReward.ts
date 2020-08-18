import { Reward } from "../../generated/schema";
import { RewardDistribution } from "../../generated/SavingsModule/SavingsModule";
import { getUniqId } from "../utils";
import { Address } from "@graphprotocol/graph-ts";

export function createReward(
  event: RewardDistribution,
  poolAddress: Address
): void {
  let reward = new Reward(getUniqId(event));
  reward.pool = poolAddress.toHex();
  reward.token = event.params.rewardRoken.toHex();
  reward.amount = event.params.amount;
  reward.date = event.block.timestamp;

  reward.save();
}
