import { Address } from "@graphprotocol/graph-ts";

export function getUserBalanceId(
  userAddress: Address,
  poolAddress: Address
): string {
  return userAddress.toHex() + "-" + poolAddress.toHex();
}
