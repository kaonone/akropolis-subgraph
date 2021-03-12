import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";

import { User } from "../../generated/schema";
import {
  Transfer,
  YVaultV2,
} from "../../generated/templates/YVaultV2/YVaultV2";
import {
  createOrUpdateUserBalance,
  loadUser,
  loadVaultPoolV2,
} from "../entities";
import { createV2TVLChangedEvent } from "../entities/vaultSavingsV2/createTVLChangedEvent";
import { loadOrCreateV2TVL } from "../entities/vaultSavingsV2/loadOrCreateTVL";
import { exclude, isAddressEquals, SUPPORTED_VAULTS } from "../utils";
import { deactivateUserIfZeroBalance } from "./deactivateUserIfZeroBalance";

export function handleTransfer(event: Transfer): void {
  let userAddress = event.params.sender;
  let user = loadUser(userAddress);

  if (
    isAddressEquals(event.params.sender, SUPPORTED_VAULTS) ||
    isAddressEquals(event.params.receiver, SUPPORTED_VAULTS)
  ) {
    let user = loadUser(event.params.sender) || loadUser(event.params.receiver);

    if (!user) {
      return;
    }

    createOrUpdateUserBalance(
      Address.fromString(user.id),
      dataSource.address(),
      event.params.value
    );
  }

  if (!user || !user.vaultPoolsV2.length) {
    return;
  }

  let yVaultAddress = dataSource.address();
  let contract = YVaultV2.bind(yVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.vaultPoolsV2 = exclude(user.vaultPoolsV2, yVaultAddress.toHex());
    deactivateUserIfZeroBalance(user as User);
    user.save();
  }

  // TODO what if there is multiple withdraws in one transaction
  let tvl = loadOrCreateV2TVL(yVaultAddress.toHex(), userAddress.toHex());

  let balanceBeforeTransfer = userBalance.plus(event.params.value);
  let shareMultiplier = BigInt.fromI32(1000000000);
  let share = balanceBeforeTransfer.isZero()
    ? BigInt.fromI32(0)
    : event.params.value.times(shareMultiplier).div(balanceBeforeTransfer);
  let withdrawTVLAmount = tvl.amount.times(share).div(shareMultiplier);

  tvl.amount = tvl.amount.minus(withdrawTVLAmount);
  tvl.save();

  let pool = loadVaultPoolV2(yVaultAddress);
  pool.totalTVL = pool.totalTVL.minus(withdrawTVLAmount);
  pool.save();

  createV2TVLChangedEvent(
    event,
    withdrawTVLAmount,
    yVaultAddress.toHex(),
    userAddress.toHex(),
    "decrease"
  );
}
