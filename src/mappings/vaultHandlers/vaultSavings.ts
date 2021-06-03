import {
  Deposit,
  VaultActivated,
  VaultDisabled,
  VaultRegistered,
} from "../../../generated/EthVaultSavingsV1/VaultSavings";
import { YVaultV1 } from "../../../generated/templates";
import {
  createOrUpdateDepositedBalance,
  createOrUpdateVault,
  loadOrCreateUser,
  loadVault,
} from "../../entities";
import { addUniq } from "../../utils";
import { activateUser } from "./../activateUser";

export function handleVaultRegistered(event: VaultRegistered, module: string): void {
  createOrUpdateVault(event.params.vault, event.params.baseToken, module);
  YVaultV1.create(event.params.vault);
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
    module,
  );

  let vaultPool = loadVault(event.params.vault);
  vaultPool.totalTVL = vaultPool.totalTVL.plus(event.params.lpAmount);
  vaultPool.save();
}
