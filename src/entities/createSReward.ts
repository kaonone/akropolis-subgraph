import { BigInt } from "@graphprotocol/graph-ts";

import { SReward } from "../../generated/schema";

export function createSReward(
  poolAddress: string,
  uniqId: string,
  poolBalance: string,
  duration: BigInt,
  token: string,
  amount: BigInt,
  date: BigInt
): void {
  let reward = new SReward(uniqId);
  reward.pool = poolAddress;
  reward.poolBalance = poolBalance;
  reward.duration = duration;
  reward.token = token;
  reward.amount = amount;
  reward.date = date;

  reward.save();
}
