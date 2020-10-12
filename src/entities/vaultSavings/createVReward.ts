import { VReward } from "../../../generated/schema";
import { RewardDistribution } from "../../../generated/VaultSavingsModule/VaultSavingsModule";
import { getUniqId } from "../../utils";
import { Address } from "@graphprotocol/graph-ts";
import { loadVaultPool } from "./loadVaultPool";

export function createVReward(
  event: RewardDistribution,
  poolAddress: Address
): void {
  let pool = loadVaultPool(poolAddress);

  let reward = new VReward(getUniqId(event));
  reward.pool = poolAddress.toHex();
  reward.poolBalance = pool.balance;
  reward.token = event.params.rewardToken.toHex();
  reward.amount = event.params.amount;
  reward.date = event.block.timestamp;

  reward.save();
}
