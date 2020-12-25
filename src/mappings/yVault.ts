import { BigInt, dataSource } from "@graphprotocol/graph-ts";

import { User } from "../../generated/schema";
import { Transfer, YVault } from "../../generated/templates/YVault/YVault";
import { loadUser, loadVaultPool } from "../entities";
import { createTVLChangedEvent } from "../entities/vaultSavings/createTVLChangedEvent";
import { loadOrCreateTVL } from "../entities/vaultSavings/loadOrCreateTVL";
import { exclude } from "../utils";
import { removeUserIfZeroBalance } from "./removeUserIfZeroBalance";

export function handleTransfer(event: Transfer): void {
  let userAddress = event.params.from;
  let user = loadUser(userAddress);

  if (!user) {
    return;
  }

  let yVaultAddress = dataSource.address();
  let contract = YVault.bind(yVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.vaultPools = exclude(user.vaultPools, yVaultAddress.toHex());

    user.save();
  }

  // TODO what if there is multiple withdraws in one transaction
  let tvl = loadOrCreateTVL(yVaultAddress.toHex(), userAddress.toHex());

  let balanceBeforeTransfer = userBalance.plus(event.params.value);
  let shareMultiplier = BigInt.fromI32(1000000000);
  let share = event.params.value.times(shareMultiplier).div(balanceBeforeTransfer);
  let withdrawTVLAmount = tvl.amount.times(share).div(shareMultiplier);

  tvl.amount = tvl.amount.minus(withdrawTVLAmount);
  tvl.save();

  let pool = loadVaultPool(yVaultAddress);
  pool.totalTVL = pool.totalTVL.minus(withdrawTVLAmount);
  pool.save();

  createTVLChangedEvent(
    event,
    event.params.value,
    yVaultAddress.toHex(),
    userAddress.toHex(),
    'decrease',
  );

  removeUserIfZeroBalance(user as User);
}
