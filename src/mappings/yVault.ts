import { BigInt, dataSource } from "@graphprotocol/graph-ts";

import { User } from "../../generated/schema";
import { Transfer, YVault } from "../../generated/templates/YVault/YVault";
import { loadUser, loadVaultPool } from "../entities";
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

  let percent = event.params.value.div(userBalance).times(BigInt.fromI32(100));
  let withdrawTVLAmount = tvl.amount.div(BigInt.fromI32(100).times(percent));

  tvl.amount = tvl.amount.minus(withdrawTVLAmount);
  tvl.save();

  let pool = loadVaultPool(yVaultAddress);
  pool.totalTVL = pool.totalTVL.minus(withdrawTVLAmount);
  pool.save();

  removeUserIfZeroBalance(user as User);
}
