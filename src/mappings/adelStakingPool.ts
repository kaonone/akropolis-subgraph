import { dataSource } from "@graphprotocol/graph-ts";

import { Staked, Unstaked } from "../../generated/ADELStakingPool/StakingPool";
import { loadOrCreateUser } from "../entities";
import { addUniq, exclude } from "../utils";
import { activateUser } from "./activateUser";
import { deactivateUserIfZeroBalance } from "./deactivateUserIfZeroBalance";

export function handleStaked(event: Staked): void {
  let user = loadOrCreateUser(event.params.user);
  user.stakingPools = addUniq(user.stakingPools, dataSource.address().toHex());
  activateUser(user);
  user.save();
}

export function handleUnstake(event: Unstaked): void {
  let user = loadOrCreateUser(event.params.user);
  user.stakingPools = exclude(user.stakingPools, dataSource.address().toHex());
  deactivateUserIfZeroBalance(user);
  user.save();
}
