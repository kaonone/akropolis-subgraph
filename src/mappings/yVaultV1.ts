import { BigInt, dataSource } from "@graphprotocol/graph-ts";

import { User } from "../../generated/schema";
import {
  Transfer,
  YVaultV1,
} from "../../generated/templates/YVaultV1/YVaultV1";
import { loadUser, loadVaultPoolV1 } from "../entities";
import { createV1TVLChangedEvent } from "../entities/vaultSavingsV1/createTVLChangedEvent";
import { loadOrCreateV1TVL } from "../entities/vaultSavingsV1/loadOrCreateTVL";
import { exclude } from "../utils";
import { deactivateUserIfZeroBalance } from "./deactivateUserIfZeroBalance";

export function handleTransfer(event: Transfer): void {
  let userAddress = event.params.from;
  let user = loadUser(userAddress);

  if (!user || !user.vaultPoolsV1.length) {
    return;
  }

  let yVaultAddress = dataSource.address();
  let contract = YVaultV1.bind(yVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.vaultPoolsV1 = exclude(user.vaultPoolsV1, yVaultAddress.toHex());
    deactivateUserIfZeroBalance(user as User);
    user.save();
  }

  // TODO what if there is multiple withdraws in one transaction
  let tvl = loadOrCreateV1TVL(yVaultAddress.toHex(), userAddress.toHex());

  let balanceBeforeTransfer = userBalance.plus(event.params.value);
  let shareMultiplier = BigInt.fromI32(1000000000);
  let share = balanceBeforeTransfer.isZero()
    ? BigInt.fromI32(0)
    : event.params.value.times(shareMultiplier).div(balanceBeforeTransfer);
  let withdrawTVLAmount = tvl.amount.times(share).div(shareMultiplier);

  tvl.amount = tvl.amount.minus(withdrawTVLAmount);
  tvl.save();

  let pool = loadVaultPoolV1(yVaultAddress);
  pool.totalTVL = pool.totalTVL.minus(withdrawTVLAmount);
  pool.save();

  createV1TVLChangedEvent(
    event,
    withdrawTVLAmount,
    yVaultAddress.toHex(),
    userAddress.toHex(),
    "decrease"
  );

}
