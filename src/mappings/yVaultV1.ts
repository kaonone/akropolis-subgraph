import { BigInt, dataSource } from "@graphprotocol/graph-ts";

import { User } from "../../generated/schema";
import { Transfer, YVaultV1 } from "../../generated/templates/YVaultV1/YVaultV1";
import { loadUser, loadVaultPoolV1 } from "../entities";
import { createV1TVLChangedEvent } from "../entities/vaultSavingsV1/createTVLChangedEvent";
import { loadOrCreateV1TVL } from "../entities/vaultSavingsV1/loadOrCreateTVL";
import { exclude } from "../utils";
import { removeUserIfZeroBalance } from "./removeUserIfZeroBalance";

export function handleTransfer(event: Transfer): void {
  let userAddress = event.params.from;
  let user = loadUser(userAddress);

  if (!user) {
    return;
  }

  let yVaultAddress = dataSource.address();
  let contract = YVaultV1.bind(yVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.vaultPoolsV1 = exclude(user.vaultPoolsV1, yVaultAddress.toHex());

    user.save();
  }

  // TODO what if there is multiple withdraws in one transaction
  let tvl = loadOrCreateV1TVL(yVaultAddress.toHex(), userAddress.toHex());

  let balanceBeforeTransfer = userBalance.plus(event.params.value);
  let shareMultiplier = BigInt.fromI32(1000000000);
  let share = event.params.value.times(shareMultiplier).div(balanceBeforeTransfer);
  let withdrawTVLAmount = tvl.amount.times(share).div(shareMultiplier);

  tvl.amount = tvl.amount.minus(withdrawTVLAmount);
  tvl.save();

  let pool = loadVaultPoolV1(yVaultAddress);
  pool.totalTVL = pool.totalTVL.minus(withdrawTVLAmount);
  pool.save();

  createV1TVLChangedEvent(
    event,
    event.params.value,
    yVaultAddress.toHex(),
    userAddress.toHex(),
    'decrease',
  );

  removeUserIfZeroBalance(user as User);
}
