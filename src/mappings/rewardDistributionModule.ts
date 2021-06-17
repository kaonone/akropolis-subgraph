import { Address, log } from "@graphprotocol/graph-ts";

import { RewardDistribution } from "../../generated/Contracts/RewardDistributionModule";
import {
  loadSPoolToken,
  loadSavingsPool,
  updateSavingsRewardDistributionDates,
  createSRewardFromRewardModuleEvent,
} from "../entities";

export function handleRewardDistribution(event: RewardDistribution): void {
  let token = loadSPoolToken(event.params.poolToken);

  if (!token) {
    log.warning("Savings pool token are not defined!", []);
  }

  if (token) {
    let pool = loadSavingsPool(Address.fromString(token.savingsPool));

    updateSavingsRewardDistributionDates(event, Address.fromString(pool.id));
    createSRewardFromRewardModuleEvent(event, Address.fromString(pool.id));
  }
}
