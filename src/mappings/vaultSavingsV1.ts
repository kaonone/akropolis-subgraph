import {
  Deposit,
  VaultActivated,
  VaultDisabled,
  VaultRegistered,
} from "../../generated/VaultSavingsV1/VaultSavingsV1";
import { YVaultV1 } from "../../generated/templates";
import {
  createOrUpdateVaultPoolV1,
  loadOrCreateUser,
  loadVaultPoolV1,
} from "../entities";
import { addUniq } from "../utils";
import { loadOrCreateV1TVL } from "../entities/vaultSavingsV1/loadOrCreateTVL";
import { createV1TVLChangedEvent } from "../entities/vaultSavingsV1/createTVLChangedEvent";
import { activateUser } from "./activateUser";

export function handleVaultRegistered(event: VaultRegistered): void {
  createOrUpdateVaultPoolV1(event.params.vault, event.params.baseToken);
  YVaultV1.create(event.params.vault);
}

export function handleVaultDisabled(event: VaultDisabled): void {
  let vault = loadVaultPoolV1(event.params.vault);
  vault.isActive = false;
  vault.save();
}

export function handleVaultActivated(event: VaultActivated): void {
  let vault = loadVaultPoolV1(event.params.vault);
  vault.isActive = true;
  vault.save();
}

export function handleDeposit(event: Deposit): void {
  let user = loadOrCreateUser(event.params.user);
  user.vaultPoolsV1 = addUniq(user.vaultPoolsV1, event.params.vault.toHex());
  user.visitedVaultPoolsV1 = addUniq(user.visitedVaultPoolsV1, event.params.vault.toHex());
  user.save();
  activateUser(user);

  let tvl = loadOrCreateV1TVL(
    event.params.vault.toHex(),
    event.params.user.toHex()
  );

  tvl.amount = tvl.amount.plus(event.params.lpAmount);
  tvl.save();

  let vaultPool = loadVaultPoolV1(event.params.vault);
  vaultPool.totalTVL = vaultPool.totalTVL.plus(event.params.lpAmount);
  vaultPool.save();

  createV1TVLChangedEvent(
    event,
    event.params.lpAmount,
    event.params.vault.toHex(),
    event.params.user.toHex(),
    "increase"
  );
}
