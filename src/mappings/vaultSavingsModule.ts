import {
  Deposit,
  VaultRegistered,
} from "../../generated/VaultSavingsModule/VaultSavingsModule";
import { YVault } from "../../generated/templates";
import { createOrUpdateVaultPool, loadOrCreateUser } from "../entities";
import { addUniq } from "../utils";

export function handleVaultRegistered(event: VaultRegistered): void {
  createOrUpdateVaultPool(event.params.vault, event.params.baseToken);
  YVault.create(event.params.vault);
}

export function handleDeposit(event: Deposit): void {
  let user = loadOrCreateUser(event.params.user);
  user.vaultPools = addUniq(user.vaultPools, event.params.vault.toHex());
  user.save();
}
