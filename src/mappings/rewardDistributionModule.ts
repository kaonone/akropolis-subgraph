import { Address } from "@graphprotocol/graph-ts";

import { RewardDistribution } from "../../generated/RewardDistributionModule/RewardDistributionModule";
import {
  loadPoolToken,
  loadSavingsPool,
  updateSavingsRewardDistributionDates,
  createSRewardFromRewardModuleEvent,
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

    updateSavingsRewardDistributionDates(event, Address.fromString(pool.id));
    createSRewardFromRewardModuleEvent(event, Address.fromString(pool.id));
  }
}
