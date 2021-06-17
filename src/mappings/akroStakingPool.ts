import { dataSource } from "@graphprotocol/graph-ts";

import { Staked, Unstaked } from "../../generated/AKROStakingPool/StakingPool";
import { createOrUpdateDepositedBalance, loadOrCreateUser } from "../entities";
import { addUniq, exclude, Modules } from "../utils";
import { activateUser } from "./activateUser";
import { deactivateUserIfZeroBalance } from "./deactivateUserIfZeroBalance";

export function handleStaked(event: Staked): void {
  let user = loadOrCreateUser(event.params.user);
  user.stakingPools = addUniq(user.stakingPools, dataSource.address().toHex());
  activateUser(user);
  user.save();

  createOrUpdateDepositedBalance(
    event.params.user,
    dataSource.address(),
    event.params.amount,
    Modules.staking
  );
}

export function handleUnstake(event: Unstaked): void {
  let user = loadOrCreateUser(event.params.user);
  user.stakingPools = exclude(user.stakingPools, dataSource.address().toHex());
  deactivateUserIfZeroBalance(user);
  user.save();

  createOrUpdateDepositedBalance(
    event.params.user,
    dataSource.address(),
    event.params.amount.neg(),
    Modules.staking
  );
}
