import { Address } from "@graphprotocol/graph-ts";

import { RewardDistribution } from "../../generated/RewardDistributionModule/RewardDistributionModule";
import {
  loadPoolToken,
  loadSavingsPool,
  updateRewardDistributionDates,
  createDistributionSReward,
} from "../entities";

export function handleRewardDistribution(event: RewardDistribution): void {
  let token = loadPoolToken(event.params.poolToken);

  if (!token.savingsPool && !token.vaultPool) {
    throw new Error(
      "token.savingsPool and token.vaultPool fields are not defined!"
    );
  }

  if (token.savingsPool) {
    let pool = loadSavingsPool(Address.fromString(token.savingsPool));

    updateRewardDistributionDates(event, Address.fromString(pool.id));
    createDistributionSReward(event, Address.fromString(pool.id));
  }
}
