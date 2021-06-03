import { Address } from "@graphprotocol/graph-ts";

export function getDepositedBalanceId(
  userAddress: Address,
  poolAddress: Address
): string {
  return userAddress.toHex() + "-" + poolAddress.toHex();
}
