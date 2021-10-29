import {
  Address,
  BigInt,
  dataSource,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

import { ERC20Detailed } from "../../generated/Contracts/ERC20Detailed";
import { BasisVaultAPR, User } from "../../generated/schema";
import {
  Deposit,
  StrategyUpdate,
  Withdraw,
} from "../../generated/templates/BasisVault/BasisVault";

import {
  loadOrCreateUser,
  loadSubgraphConfig,
  loadUser,
} from "../entities/shared";
import {
  activateUser,
  deactivateUserIfZeroBalance,
} from "../entities/globalStats";
import {
  loadBasisVaultState,
  createOrUpdateBasisVaultState,
} from "../entities/basisVaults";
import { createEventLog } from "../entities/logs";
import { addUniq, EventType, exclude } from "../utils";
import { getVaultAprId } from "../utils/getVaultAprId";

export function handleDeposit(event: Deposit): void {
  let basisVaultAddress = dataSource.address();
  let user = loadOrCreateUser(event.params.user);
  user.basisVaults = addUniq(user.basisVaults, basisVaultAddress.toHex());
  activateUser(user);
  user.save();

  createEventLog(
    event,
    basisVaultAddress,
    event.params.user,
    EventType.BASIS_VAULT_DEPOSIT
  );
}

export function handleWithdraw(event: Withdraw): void {
  let basisVaultAddress = dataSource.address();
  let userAddress = event.params.user;
  let user = loadUser(userAddress);

  makeAprSnapshot(event.block, basisVaultAddress);

  if (!user || !user.basisVaults.includes(basisVaultAddress.toHex())) {
    return;
  }

  let contract = ERC20Detailed.bind(basisVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.basisVaults = exclude(user.basisVaults, basisVaultAddress.toHex());
    deactivateUserIfZeroBalance(user as User);
    user.save();
  }

  createEventLog(
    event,
    basisVaultAddress,
    event.params.user,
    EventType.BASIS_VAULT_WITHDRAW
  );
}

export function handleStrategyUpdate(event: StrategyUpdate): void {
  let basisVaultAddress = dataSource.address();
  makeAprSnapshot(event.block, basisVaultAddress);
}

function makeAprSnapshot(block: ethereum.Block, vaultAddress: Address): void {
  let config = loadSubgraphConfig();
  let prevVaultState = loadBasisVaultState(vaultAddress);
  let currentVaultState = createOrUpdateBasisVaultState(block, vaultAddress);

  if (!prevVaultState || prevVaultState.updatedAtBlock.equals(block.number)) {
    return;
  }

  if (currentVaultState.updatedAtBlock.equals(prevVaultState.updatedAtBlock)) {
    log.warning("Something went wrong", []);
  }

  let decimalsBase = BigInt.fromI32(10 as i32).pow(config.aprDecimals as u8);

  let a1 = prevVaultState.totalAssets;
  let s1 = prevVaultState.totalShares;
  let a2 = currentVaultState.totalAssets;
  let s2 = currentVaultState.totalShares;

  // apr = (a2 / s2 - a1 / s1) / (a1 / s1) = (a2 * s1) / (s2 * a1) - 1
  let aprValue =
    a1.isZero() || s2.isZero()
      ? BigInt.fromI32(0 as i32)
      : decimalsBase
          .times(a2)
          .times(s1)
          .div(s2)
          .div(a1)
          .minus(decimalsBase);

  let apr = new BasisVaultAPR(getVaultAprId(vaultAddress, block.number));

  apr.fromDate = prevVaultState.updatedAtDate;
  apr.toDate = currentVaultState.updatedAtDate;
  apr.value = aprValue;
  apr.vault = vaultAddress.toHex();

  apr.save();
}
