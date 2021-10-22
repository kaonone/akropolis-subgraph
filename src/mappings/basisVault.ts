import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { Deposit, Withdraw } from "../../generated/BasisVault/BasisVault";
import { ERC20Detailed } from "../../generated/BasisVault/ERC20Detailed";
import { User } from "../../generated/schema";
import {
  activateUser,
  deactivateUserIfZeroBalance,
  loadOrCreateUser,
  loadUser,
} from "../entities";
import { addUniq, exclude } from "../utils";

export function handleDeposit(event: Deposit): void {
  let basisVaultAddress = dataSource.address();
  let user = loadOrCreateUser(event.params.user);
  user.basisVaults = addUniq(user.basisVaults, basisVaultAddress.toHex());
  activateUser(user);
  user.save();
}

export function handleWithdraw(event: Withdraw): void {
  let basisVaultAddress = dataSource.address();
  let userAddress = event.params.user;
  let user = loadUser(userAddress);

  if (!user || !user.basisVaults.includes(basisVaultAddress.toHex())) {
    return;
  }

  let contract = ERC20Detailed.bind(basisVaultAddress);
  let userBalance = contract.balanceOf(userAddress);

  if (userBalance.le(BigInt.fromI32(0))) {
    user.basisVaults = exclude(user.basisVaults, basisVaultAddress.toHex());
    deactivateUserIfZeroBalance(user as User);
    user.save();
  }
}
