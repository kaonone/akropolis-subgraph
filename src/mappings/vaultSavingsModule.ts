import {
  Deposit,
  VaultRegistered,
} from "../../generated/VaultSavingsModule/VaultSavingsModule";
import { YVault } from "../../generated/templates";
import { createOrUpdateVaultPool, loadOrCreateUser, loadVaultPool } from "../entities";
import { addUniq } from "../utils";
import { loadOrCreateTVL } from "../entities/vaultSavings/loadOrCreateTVL";
import { createTVLChangedEvent } from "../entities/vaultSavings/createTVLChangedEvent";

export function handleVaultRegistered(event: VaultRegistered): void {
  createOrUpdateVaultPool(event.params.vault, event.params.baseToken);
  YVault.create(event.params.vault);
}

export function handleDeposit(event: Deposit): void {
  let user = loadOrCreateUser(event.params.user);
  user.vaultPools = addUniq(user.vaultPools, event.params.vault.toHex());
  user.save();

  let tvl = loadOrCreateTVL(
    event.params.vault.toHex(),
    event.params.user.toHex()
  );

  tvl.amount = tvl.amount.plus(event.params.lpAmount);
  tvl.save();

  let vaultPool = loadVaultPool(event.params.vault);
  vaultPool.totalTVL = vaultPool.totalTVL.plus(event.params.lpAmount);
  vaultPool.save();

  createTVLChangedEvent(
    event,
    event.params.lpAmount,
    event.params.vault.toHex(),
    event.params.user.toHex(),
    'increase',
  );
}
