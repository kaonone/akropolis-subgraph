import { Address, BigInt } from "@graphprotocol/graph-ts";

import { DepositedBalance } from "../../../generated/schema";
import { getDepositedBalanceId } from "../../utils";

export function loadDepositedBalance(
  userAddress: Address,
  poolAddress: Address,
): DepositedBalance {
  let id = getDepositedBalanceId(userAddress, poolAddress);
  let balance = DepositedBalance.load(id);

  if (!balance) {
    balance = new DepositedBalance(id);
    balance.value = BigInt.fromI32(0);
    balance.pool = poolAddress;
    balance.user = userAddress.toHex();
  }

  balance.save();

  return balance as DepositedBalance;
}
