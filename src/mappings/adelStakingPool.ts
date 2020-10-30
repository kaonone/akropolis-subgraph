import { dataSource } from "@graphprotocol/graph-ts";

import { Staked, Unstaked } from "../../generated/ADELStakingPool/StakingPool";
import { loadUser } from "../entities";
import { addUniq, exclude } from "../utils";
import { removeUserIfZeroBalance } from "./removeUserIfZeroBalance";

export function handleStaked(event: Staked): void {
  let user = loadUser(event.params.user);
  user.stakingPools = addUniq(user.stakingPools, dataSource.address().toHex());
  user.save();
}

export function handleUnstake(event: Unstaked): void {
  let user = loadUser(event.params.user);
  user.stakingPools = exclude(user.stakingPools, dataSource.address().toHex());
  user.save();
  removeUserIfZeroBalance(user);
}
