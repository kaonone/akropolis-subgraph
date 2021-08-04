import { dataSource, log } from "@graphprotocol/graph-ts";

import { Staked, Unstaked } from "../../generated/ADELStakingPool/StakingPool";
import {
  createOrUpdateDepositedBalance,
  loadOrCreateUser,
  activateUser,
  deactivateUserIfZeroBalance,
  increaseStakingUsersCount,
  decreaseStakingUsersCount,
} from "../entities";
import { addUniq, exclude, Modules } from "../utils";

export function handleStaked(event: Staked): void {
  let stakingPoolAddress = dataSource.address().toHex();

  let user = loadOrCreateUser(event.params.user);
  let isFirstStake = !user.stakingPools.includes(stakingPoolAddress);

  log.warning("pools: {}; pool: {}; isFirstStake: {}", [
    user.stakingPools.join(", "),
    stakingPoolAddress,
    isFirstStake ? 'true' : 'false',
  ]);

  user.stakingPools = addUniq(user.stakingPools, stakingPoolAddress);
  activateUser(user);
  user.save();

  if (isFirstStake) {
    increaseStakingUsersCount(dataSource.address());
  }

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

  decreaseStakingUsersCount(dataSource.address());

  createOrUpdateDepositedBalance(
    event.params.user,
    dataSource.address(),
    event.params.amount.neg(),
    Modules.staking
  );
}
