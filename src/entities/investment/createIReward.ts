import { Address } from "@graphprotocol/graph-ts";

import { IReward } from "../../../generated/schema";
import { RewardDistribution } from "../../../generated/InvestmentModule/InvestmentModule";
import { getUniqId } from "../../utils";

export function createIReward(
  event: RewardDistribution,
  poolAddress: Address
): void {
  let reward = new IReward(getUniqId(event));
  reward.pool = poolAddress.toHex();
  reward.token = event.params.rewardRoken.toHex();
  reward.amount = event.params.amount;
  reward.date = event.block.timestamp;

  reward.save();
}
