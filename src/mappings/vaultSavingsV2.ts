import {
  Deposit,
  VaultRegistered,
} from "../../generated/VaultSavingsV2/VaultSavingsV2";
import { YVaultV2 } from "../../generated/templates";
import {
  createOrUpdateVaultPoolV2,
  loadOrCreateUser,
  loadVaultPoolV2,
} from "../entities";
import { addUniq } from "../utils";
import { loadOrCreateV2TVL } from "../entities/vaultSavingsV2/loadOrCreateTVL";
import { createV2TVLChangedEvent } from "../entities/vaultSavingsV2/createTVLChangedEvent";

export function handleVaultRegistered(event: VaultRegistered): void {
  createOrUpdateVaultPoolV2(event.params.vault, event.params.baseToken);
  YVaultV2.create(event.params.vault);
}

export function handleDeposit(event: Deposit): void {
  let user = loadOrCreateUser(event.params.user);
  user.vaultPoolsV2 = addUniq(user.vaultPoolsV2, event.params.vault.toHex());
  user.save();

  let tvl = loadOrCreateV2TVL(
    event.params.vault.toHex(),
    event.params.user.toHex()
  );

  tvl.amount = tvl.amount.plus(event.params.lpAmount);
  tvl.save();

  let vaultPool = loadVaultPoolV2(event.params.vault);
  vaultPool.totalTVL = vaultPool.totalTVL.plus(event.params.lpAmount);
  vaultPool.save();

  createV2TVLChangedEvent(
    event,
    event.params.lpAmount,
    event.params.vault.toHex(),
    event.params.user.toHex(),
    "increase"
  );
}
