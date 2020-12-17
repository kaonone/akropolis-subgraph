import { BigInt, dataSource } from "@graphprotocol/graph-ts";

import { User } from "../../generated/schema";
import { Transfer, YVault } from "../../generated/templates/YVault/YVault";
import { loadUser } from "../entities";
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

  removeUserIfZeroBalance(user as User);
}
