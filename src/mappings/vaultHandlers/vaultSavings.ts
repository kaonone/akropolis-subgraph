import {
  Deposit,
  VaultActivated,
  VaultDisabled,
  VaultRegistered,
} from "../../../generated/VaultSavings/VaultSavings";
import { Vault } from "../../../generated/templates";
import {
  createOrUpdateDepositedBalance,
  createVault,
  loadOrCreateUser,
  loadVault,
  activateUser,
} from "../../entities";
import { addUniq } from "../../utils";

export function handleVaultRegistered(
  event: VaultRegistered,
  module: string
): void {
  createVault(event.block, event.params.vault, event.params.baseToken, module);
  Vault.create(event.params.vault);
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

export function handleDeposit(event: Deposit, module: string): void {
  let user = loadOrCreateUser(event.params.user);
  user.vaults = addUniq(user.vaults, event.params.vault.toHex());
  activateUser(user);
  user.save();

  createOrUpdateDepositedBalance(
    event.params.user,
    event.params.vault,
    event.params.lpAmount,
    module
  );

  let vaultPool = loadVault(event.params.vault);
  vaultPool.totalTVL = vaultPool.totalTVL.plus(event.params.lpAmount);
  vaultPool.save();
}
