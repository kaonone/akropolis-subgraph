import { dataSource } from "@graphprotocol/graph-ts";

import { Staked, Unstaked } from "../../generated/AKROStakingPool/StakingPool";
import {
  createOrUpdateDepositedBalance,
  loadOrCreateUser,
  loadDepositedBalance,
} from "../entities/shared";
import {
  activateUser,
  deactivateUserIfZeroBalance,
} from "../entities/globalStats";
import {
  increaseStakingUsersCount,
  decreaseStakingUsersCount,
} from "../entities/staking";
import { createEventLog } from "../entities/logs";
import { addUniq, EventType, exclude } from "../utils";

export function handleStaked(event: Staked): void {
  let stakingPoolAddress = dataSource.address();

  let user = loadOrCreateUser(event.params.user);
  let deposited = loadDepositedBalance(event.params.user, dataSource.address());
  let isFirstStake = deposited.value.isZero();

  user.stakingPools = addUniq(user.stakingPools, stakingPoolAddress.toHex());
  activateUser(user);
  user.save();

  if (isFirstStake) {
    increaseStakingUsersCount(dataSource.address());
  }

  createEventLog(
    event,
    stakingPoolAddress,
    event.params.user,
    EventType.STACKING_POOL_STAKE
  );

  createOrUpdateDepositedBalance(
    event.params.user,
    dataSource.address(),
    event.params.amount
  );
}

export function handleUnstake(event: Unstaked): void {
  let stakingPoolAddress = dataSource.address();

  let user = loadOrCreateUser(event.params.user);
  user.stakingPools = exclude(user.stakingPools, dataSource.address().toHex());
  deactivateUserIfZeroBalance(user);
  user.save();

  createEventLog(
    event,
    stakingPoolAddress,
    event.params.user,
    EventType.STACKING_POOL_UNSTAKE
  );

  let deposited = createOrUpdateDepositedBalance(
    event.params.user,
    dataSource.address(),
    event.params.amount.neg()
  );

  let isLastUnstake = deposited.value.isZero();

  if (isLastUnstake) {
    decreaseStakingUsersCount(dataSource.address());
  }
}
