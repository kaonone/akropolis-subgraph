import {
  Deposit,
  VaultActivated,
  VaultDisabled,
  VaultRegistered,
} from "../../generated/YearnVaultSavings/YearnVaultSavings";

import { YearnVaultV2 } from "../../generated/templates";
import {
  createOrUpdateDepositedBalance,
  loadOrCreateUser,
} from "../entities/shared";
import { activateUser } from "../entities/globalStats";
import { createVault, loadVault } from "../entities/yearnVaultSavings";

import { addUniq } from "../utils";

export function handleVaultRegistered(event: VaultRegistered): void {
  createVault(event.block, event.params.vault, event.params.baseToken);
  YearnVaultV2.create(event.params.vault);
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
  user.yearnVaults = addUniq(user.yearnVaults, event.params.vault.toHex());
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
