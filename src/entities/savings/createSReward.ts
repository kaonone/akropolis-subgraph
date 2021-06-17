import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts";

import { RewardDistribution as SavingsRewardDistribution } from "../../../generated/Contracts/SavingsModule";
import { RewardDistribution as RewardDistributionFromReward } from "../../../generated/Contracts/RewardDistributionModule";
import { SReward } from "../../../generated/schema";
import { getUniqId } from "../../utils";
import { loadSavingsPool } from "./loadSavingsPool";

export function createSRewardFromSavingsModuleEvent(
  event: SavingsRewardDistribution,
  poolAddress: Address
): void {
  createSReward(
    event,
    poolAddress,
    event.params.rewardRoken,
    event.params.amount
  );
}

export function createSRewardFromRewardModuleEvent(
  event: RewardDistributionFromReward,
  poolAddress: Address
): void {
  createSReward(
    event,
    poolAddress,
    event.params.rewardToken,
    event.params.amount
  );
}

function createSReward(
  event: ethereum.Event,
  poolAddress: Address,
  rewardToken: Address,
  amount: BigInt
): void {
  let pool = loadSavingsPool(poolAddress);

  let reward = new SReward(getUniqId(event));
  reward.pool = pool.id;
  reward.poolBalance = pool.balance;
  reward.duration = event.block.timestamp.minus(
    pool.prevRewardDistributionDate
  );
  reward.token = rewardToken.toHex();
  reward.amount = amount;
  reward.date = event.block.timestamp;

  reward.save();
}
