import {
  Deposit,
  VaultActivated,
  VaultDisabled,
  VaultRegistered,
} from "../../generated/YEarnVaultSavings/YEarnVaultSavings";

import { YEarnVaultV2 } from "../../generated/templates";
import {
  createOrUpdateDepositedBalance,
  createVault,
  loadOrCreateUser,
  loadVault,
  activateUser,
} from "../entities";

import { addUniq } from "../utils";

export function handleVaultRegistered(event: VaultRegistered): void {
  createVault(event.block, event.params.vault, event.params.baseToken);
  YEarnVaultV2.create(event.params.vault);
}

export function handleVaultDisabled(event: VaultDisabled): void {
  let vault = loadVault(event.params.vault);
  vault.isActive = false;
  vault.save();
}

export function handleVaultActivated(event: VaultActivated): void {
  let vault = loadVault(event.params.vault);
  vault.isActive = true;
  vault.save();
}

export function handleDeposit(event: Deposit): void {
  let user = loadOrCreateUser(event.params.user);
  user.yEarnVaults = addUniq(user.yEarnVaults, event.params.vault.toHex());
  activateUser(user);
  user.save();

  createOrUpdateDepositedBalance(
    event.params.user,
    event.params.vault,
    event.params.lpAmount
  );

  let vaultPool = loadVault(event.params.vault);
  vaultPool.totalTVL = vaultPool.totalTVL.plus(event.params.lpAmount);
  vaultPool.save();
}
